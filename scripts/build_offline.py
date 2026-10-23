#!/usr/bin/env python3
"""Produce a single HTML file containing local CSS, JS, and exam dataset."""
import re, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
page=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/style.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
raw=json.loads((ROOT/'data/exams-all.json').read_text(encoding='utf-8'))
json_src=json.dumps(raw,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
page=page.replace('<link rel="stylesheet" href="css/style.css">','<style>'+css+'</style>')
page=page.replace('<script src="js/app.js"></script>', '<script type="application/json" id="embeddedExamData">'+json_src+'</script>\n<script>'+js+'</script>')
p=ROOT/'offline/G100C_PCQ_시뮬레이터_v12_오프라인.html';p.parent.mkdir(exist_ok=True)
p.write_text(page,encoding='utf-8')
print(p,len(page))
