/**
 * 熊ダメ計算機 v2.0.0
 * スプレッドシート連携・メンバー個別デフォルト値対応版
 */

// --- 1. 設定項目 ---
// ⚠️ あなたがデプロイした「新しいGASのウェブアプリURL」に貼り替えてください
const SPREADSHEET_API_URL = "https://script.google.com/macros/s/AKfycbwWEDwwO4vSFzdOkMY6NEbqIrd-DEREvKgUg5YZTFWPODvlVHsPChv5UtlMbM9u_mCD/exec";

// スプシから取得したデータを保持する変数（初期値は予備）
let memberData = { "るびぃ": 100000, "じゃんく": 100000 };
let currentMember = "るびぃ"; 

// 計算用変数
let isP = {I:1,L:1,A:1}, cur = {I:33000,L:33000,A:34000};

// --- 2. 初期化処理 ---
async function it() {
    // セレクトボックスの生成（FC段階とTier）
    const fcs = ["なし","1","2","3","4","5","6","7","8","9","10"];
    const tiers = ["T7","T8","T9","T10","T11"];
    document.querySelectorAll('[id^="fc"]').forEach(s => { fcs.forEach(f => s.add(new Option("FC "+f,f))); });
    document.querySelectorAll('select[id^="t"]').forEach(s => { tiers.forEach(t => s.add(new Option(t,t))); });
    
    // デフォルト設定
    setDefault("4", "T10");

    // 【重要】スプレッドシートからデータを取得
    try {
        const response = await fetch(SPREADSHEET_API_URL);
        const data = await response.json();
        // data は { "ruby": 100000, "junk": 150000 } のような形式を想定
        // スプシの名前（るびぃ/じゃんく）に合わせて整理
        memberData["るびぃ"] = data.ruby;
        memberData["じゃんく"] = data.junk;
        
        // 起動時のメンバー（るびぃ）の数値をセット
        document.getElementById('tr').value = memberData[currentMember];
    } catch (e) {
        console.error("スプシデータの取得に失敗しました。予備数値を使用します。:", e);
    }
    
    sy(); // 画面更新
}

// --- 3. エディション切り替え ---
function toggleEdition() {
    const b = document.body;
    const label = document.getElementById('editionLabel');
    const inputTr = document.getElementById('tr');
    
    // メンバーを交代
    currentMember = (currentMember === "るびぃ") ? "じゃんく" : "るびぃ";
    
    // デザイン反映
    b.classList.toggle('junk-theme', currentMember === "じゃんく");
    label.innerText = currentMember + "edition";
    
    // 【重要】スプシから取得済みのメンバー別数値を入力欄にセット
    if (memberData[currentMember]) {
        inputTr.value = memberData[currentMember];
    }
    
    sy(); // 再計算
}

// --- 4. 計算・同期ロジック (以前のものを改良) ---
function sy() {
    const tot = parseInt(document.getElementById('tr').value);
    document.getElementById('tDisp').innerText = tot.toLocaleString();
    let sumP = 0;
    ['I','L','A'].forEach(t => { 
        if(isP[t]) cur[t] = Math.floor(tot*(parseFloat(document.getElementById('i'+t).value)||0)/100);
        sumP += Math.round(cur[t]/tot*100);
    });
    ['I','L','A'].forEach(t => { 
        document.getElementById('s'+t).innerText = `→ ${cur[t].toLocaleString()}`; 
    });
    calc();
}

function calc() {
    // 以前の calc() 関数（ダメージ計算ロジック）をそのままここに貼り付けてください
    // ※ data.js の D 変数を使って計算する部分です
}

// その他の補助関数（setDefault, cl, re, vM, st, rs など）も以前と同じものを下に続けます
window.onload = it;

