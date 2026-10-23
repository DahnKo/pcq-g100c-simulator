#!/usr/bin/env python3
"""Rebuild index, combined browser dataset and CSV from dated JSON records."""
import csv, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data'
exams=[]
for p in (DATA/'exams').glob('*.json'):
    obj=json.loads(p.read_text(encoding='utf-8'))
    if obj['id'] != p.stem: raise ValueError(f'Filename != ID: {p}')
    exams.append(obj)
exams.sort(key=lambda e:e['date'],reverse=True)
# Persist type numbering so adding a future pattern never renumbers existing types.
type_file=DATA/'terminal-types.json'
registr=json.loads(type_file.read_text(encoding='utf-8'))
def signature(t): return tuple(t.get(k,'') for k in ('P3','P4','P5'))
registered={signature(t):t['number'] for t in registr['types']}
for e in exams:
    terms=e['task1']['terminalFunctions']
    key=signature(terms)
    if key not in registered:
        new_number=max(registered.values(),default=0)+1
        registered[key]=new_number
        registr['types'].append({'number':new_number, **{k:terms.get(k,'') for k in ('P3','P4','P5')}})
        print(f'New terminal assignment type {new_number}: {key}')
    e['terminalType']=registered[key]
type_file.write_text(json.dumps(registr,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if len({x['id'] for x in exams}) != len(exams): raise ValueError('Duplicate exam IDs')
index=[{'id':e['id'],'date':e['date'],'title':e['title'],'path':f'exams/{e["id"]}.json','task3Title':e['task3']['taskLabel'],'terminalType':e['terminalType'],'validated':e['extraction']['status']=='auto_extracted'} for e in exams]
for file,records in [('exams-all.json',exams),('index.json',index)]:
 (DATA/file).write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (DATA/'exams-summary.csv').open('w',encoding='utf-8-sig',newline='') as f:
 writer=csv.writer(f)
 writer.writerow(['시험일','파일명','1과제 PDF 페이지','P3','P4','P5','단자배치 유형','0속 Hz','1속 Hz','2속 Hz','3속 Hz','3과제명','3과제 PDF 페이지','자동추출 점검사항'])
 for e in exams:
  writer.writerow([e['date'],e['source']['filename'],e['source']['task1Page'],*[e['task1']['terminalFunctions'].get('P'+str(i),'') for i in [3,4,5]],e['terminalType'],*[e['task1']['speeds'].get(str(i),{}).get('hz','') for i in range(4)],e['task3']['taskLabel'],e['source']['task3Page'],'; '.join(e['extraction']['warnings'])])
print(f'Rebuilt {len(exams)} exams: {len([x for x in exams if x["extraction"]["warnings"]])} flagged')
