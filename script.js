const SPREADSHEET_API_URL = "https://script.google.com/macros/s/AKfycbwWEDwwO4vSFzdOkMY6NEbqIrd-DEREvKgUg5YZTFWPODvlVHsPChv5UtlMbM9u_mCD/exec";
let memberData = { ruby: 100000, junk: 100000 };
let currentMemberKey = "ruby";
let isP = {I:1,L:1,A:1}, cur = {I:33000,L:33000,A:34000};

async function it() {
    const fcs = ["なし","1","2","3","4","5","6","7","8","9","10"];
    const tiers = ["T7","T8","T9","T10","T11"];
    document.querySelectorAll('[id^="fc"]').forEach(s => { fcs.forEach(f => s.add(new Option("FC "+f,f))); });
    document.querySelectorAll('select[id^="t"]').forEach(s => { tiers.forEach(t => s.add(new Option(t,t))); });
    
    setDefault("4", "T10");

    try {
        const response = await fetch(SPREADSHEET_API_URL);
        const data = await response.json();
        memberData.ruby = data.ruby;
        memberData.junk = data.junk;
        document.getElementById('tr').value = memberData[currentMemberKey];
    } catch (e) {
        console.error("スプシ接続エラー:", e);
    }
    sy();
}

function toggleEdition() {
    currentMemberKey = (currentMemberKey === "ruby") ? "junk" : "ruby";
    document.body.classList.toggle('junk-theme', currentMemberKey === "junk");
    document.getElementById('editionLabel').innerText = (currentMemberKey === "ruby" ? "るびぃ" : "じゃんく") + "edition";
    document.getElementById('tr').value = memberData[currentMemberKey];
    sy();
}

function sy() {
    const tot = parseInt(document.getElementById('tr').value);
    document.getElementById('tDisp').innerText = tot.toLocaleString();
    let sumP = 0;
    ['I','L','A'].forEach(t => { 
        if(isP[t]) cur[t] = Math.floor(tot*(parseFloat(document.getElementById('i'+t).value)||0)/100);
        sumP += Math.round(cur[t]/tot*100);
    });
    const remDisp = document.getElementById('remDisp');
    if(remDisp) remDisp.innerText = `残り：${100 - sumP}%`;
    
    ['I','L','A'].forEach(t => { 
        const sElem = document.getElementById('s'+t);
        if(sElem) sElem.innerText = `→ ${cur[t].toLocaleString()}`; 
    });
    calc();
}

function hi(t) {
    const tot = parseInt(document.getElementById('tr').value);
    const v = parseFloat(document.getElementById('i'+t).value)||0;
    cur[t] = Math.floor(tot*(v/100));
    sy();
}

function calc() {
    const process = (row, key, atkId, kilId) => {
        const fc = document.getElementById('fc'+row).value, t = document.getElementById('t'+row).value,
              b = (D[key][fc] && D[key][fc][t]) ? D[key][fc][t] : D[key]["なし"][t],
              a = parseFloat(document.getElementById(atkId).value)||0, k = parseFloat(document.getElementById(kilId).value)||0;
        const base = b[0] * b[1];
        const coeff = base * (1 + a/100) * (1 + k/100);
        return {dmg: Math.sqrt(cur[row.toUpperCase()]) * coeff, m: coeff};
    };
    const rI = process('i','盾','bAi','bKi'), rL = process('l','槍','bAl','bKl'), rA = process('a','弓','bAa','bKa');
    document.getElementById('resDmg').innerText = Math.floor(rI.dmg + rL.dmg + rA.dmg).toLocaleString();
    const sQ = rI.m**2 + rL.m**2 + rA.m**2;
    if(sQ>0) {
        const pI = Math.round(rI.m**2/sQ*100), pL = Math.round(rL.m**2/sQ*100), pA = 100 - pI - pL;
        document.getElementById('bT').innerText = `推奨: 盾${pI}% 槍${pL}% 弓${pA}%`;
    }
}

function rs() {
    ['bAi','bKi','bAl','bKl','bAa','bKa'].forEach(id => document.getElementById(id).value="0.0");
    document.getElementById('iI').value=33; document.getElementById('iL').value=33; document.getElementById('iA').value=34;
    document.getElementById('tr').value = memberData[currentMemberKey];
    sy();
}

function setDefault(f, t) {
    document.querySelectorAll('[id^="fc"]').forEach(s => s.value = f);
    document.querySelectorAll('select[id^="t"]').forEach(s => s.value = t);
}

it();
