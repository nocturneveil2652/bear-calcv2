const SPREADSHEET_API_URL = "https://script.google.com/macros/s/AKfycbwWEDwwO4vSFzdOkMY6NEbqIrd-DEREvKgUg5YZTFWPODvlVHsPChv5UtlMbM9u_mCD/exec";

// メンバーごとの設定（ティアとFCのデフォルトをここで指定）
let memberData = {
    ruby: { tr: 100000, fc: "4", t: "T10" },
    junk: { tr: 100000, fc: "5", t: "T10" }
};
let currentKey = "ruby"; 
let isP = {I:1,L:1,A:1}, cur = {I:33000,L:33000,A:34000};

async function it() {
    // 1. セレクトボックスの作成
    const fcs = ["なし","1","2","3","4","5","6","7","8","9","10"];
    const tiers = ["T7","T8","T9","T10","T11"];
    document.querySelectorAll('[id^="fc"]').forEach(s => { fcs.forEach(f => s.add(new Option("FC "+f,f))); });
    document.querySelectorAll('select[id^="t"]').forEach(s => { tiers.forEach(t => s.add(new Option(t,t))); });
    
    // 2. 画面を初期設定にする
    applyMemberSettings();

    // 3. スプシから数値を取得して反映
    try {
        const response = await fetch(SPREADSHEET_API_URL);
        const data = await response.json();
        if(data.ruby) memberData.ruby.tr = data.ruby;
        if(data.junk) memberData.junk.tr = data.junk;
        
        // 届いた数値を現在の画面に反映
        document.getElementById('tr').value = memberData[currentKey].tr;
        sy(); // 届いた瞬間に再計算
    } catch (e) {
        console.error("スプシ取得失敗:", e);
    }
}

function applyMemberSettings() {
    const config = memberData[currentKey];
    document.getElementById('tr').value = config.tr;
    document.querySelectorAll('[id^="fc"]').forEach(s => s.value = config.fc);
    document.querySelectorAll('select[id^="t"]').forEach(s => s.value = config.t);
    sy(); 
}

function toggleEdition() {
    currentKey = (currentKey === "ruby") ? "junk" : "ruby";
    document.body.classList.toggle('junk-theme', currentKey === "junk");
    document.getElementById('editionLabel').innerText = (currentKey === "ruby" ? "るびぃ" : "じゃんく") + "edition";
    applyMemberSettings();
}

function sy() {
    const trInput = document.getElementById('tr');
    if(!trInput) return;
    const tot = parseInt(trInput.value) || 0;
    document.getElementById('tDisp').innerText = tot.toLocaleString();
    
    let sumP = 0;
    ['I','L','A'].forEach(t => { 
        const inputElem = document.getElementById('i'+t);
        if(isP[t]) cur[t] = Math.floor(tot*(parseFloat(inputElem.value)||0)/100);
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
    const tot = parseInt(document.getElementById('tr').value) || 0;
    const v = parseFloat(document.getElementById('i'+t).value)||0;
    cur[t] = Math.floor(tot*(v/100));
    sy();
}

function calc() {
    if (typeof D === 'undefined') return;
    const resDmgElem = document.getElementById('resDmg');
    if(!resDmgElem) return;

    const process = (row, key, atkId, kilId) => {
        const fc = document.getElementById('fc'+row).value;
        const t = document.getElementById('t'+row).value;
        const b = (D[key][fc] && D[key][fc][t]) ? D[key][fc][t] : D[key]["なし"][t];
        const a = parseFloat(document.getElementById(atkId).value)||0;
        const k = parseFloat(document.getElementById(kilId).value)||0;
        const base = b[0] * b[1];
        const coeff = base * (1 + a/100) * (1 + k/100);
        return {dmg: Math.sqrt(cur[row.toUpperCase()]) * coeff, m: coeff};
    };

    const rI = process('i','盾','bAi','bKi');
    const rL = process('l','槍','bAl','bKl');
    const rA = process('a','弓','bAa','bKa');
    
    resDmgElem.innerText = Math.floor(rI.dmg + rL.dmg + rA.dmg).toLocaleString();

    const sQ = rI.m**2 + rL.m**2 + rA.m**2;
    if(sQ > 0) {
        const pI = Math.round(rI.m**2/sQ*100), pL = Math.round(rL.m**2/sQ*100), pA = 100 - pI - pL;
        document.getElementById('bT').innerText = `推奨: 盾${pI}% 槍${pL}% 弓${pA}%`;
    }
}

function rs() {
    ['bAi','bKi','bAl','bKl','bAa','bKa'].forEach(id => document.getElementById(id).value="0.0");
    document.getElementById('iI').value=33; document.getElementById('iL').value=33; document.getElementById('iA').value=34;
    applyMemberSettings();
}

// 最後に初期化を実行
it();

