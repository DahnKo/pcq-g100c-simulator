#!/usr/bin/env python3
"""Structural checks; discrepancies in original printed exams are reported, not silently corrected."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
exams=json.loads((ROOT/'data/exams-all.json').read_text(encoding='utf-8'))
ids=set();errors=[];warnings=[]
for e in exams:
 ident=e['id'];d=e['date'];t=e['task1'];s=t['speeds']
 if ident in ids:errors.append((ident,'duplicate id'))
 ids.add(ident)
 if not re.fullmatch(r'20\d\d-\d\d-\d\d',d) or ident!=d:errors.append((ident,'date/id'))
 if any(k not in s or 'hz' not in s[k] for k in ['0','1','2','3']):errors.append((ident,'missing speed'))
 if sorted(t['terminalFunctions'])!=['P3','P4','P5']:errors.append((ident,'terminal function list'))
 if 'bx' not in s:errors.append((ident,'missing emergency stop'))
 if not e['task3']['operationSteps']:errors.append((ident,'empty task3'))
 if not e['source']['task1Page'] or not e['source']['task3Page']:errors.append((ident,'source pages'))
 # Warning rather than auto-correct conflicts between terminals and truth table.
 for speed,func in [('1','Speed-L'),('2','Speed-M')]:
  term=next((k for k,v in t['terminalFunctions'].items() if v==func),None)
  if term and s.get(speed,{}).get('switches',{}).get('SS'+str(int(term[-1])-2)) != 'ON':
   warnings.append((ident,func,speed))
assert len(exams)==len(list((ROOT/'data/exams').glob('*.json')))
if errors:
 print('FAIL',errors);sys.exit(1)
print(f'OK: {len(exams)} dated exams; {len(warnings)} terminal / speed discrepancies flagged')
for w in warnings:print('ORIGINAL EXAM NEEDS REVIEW:',*w)
