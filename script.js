// --- 設定項目（改良版スプシのURLを貼る） ---
const SPREADSHEET_API_URL = "あなたの新しいGASのURL";
let memberData = {}; // スプシから取得した全データを格納する箱

let currentMember = "るびぃ";
let isP = {I:1,L:1,A:1}, cur = {I:33000,L:33000,A:34000};

async function it() {
    // セレクトボックス初期化などは以前と同じ
    initSelectors(); 
    setDefault("4", "T10");

    // スプシから全メンバーの数値を一括読み込み
    try {
        const response = await fetch(SPREADSHEET_API_URL);
        memberData = await response.json(); // { "るびぃ": 100000, "じゃんく": 120000, ... }
        
        // 初期の出征数をセット
        if (memberData[currentMember]) {
            document.getElementById('tr').value = memberData[currentMember];
        }
    } catch (e) {
        console.error("データ取得失敗:", e);
    }
    
    sy();
}

function toggleEdition() {
    const b = document.body;
    const label = document.getElementById('editionLabel');
    const inputTr = document.getElementById('tr');
    
    // 切り替えロジック
    currentMember = (currentMember === "るびぃ") ? "じゃんく" : "るびぃ";
    
    b.classList.toggle('junk-theme', currentMember === "じゃんく");
    label.innerText = currentMember + "edition";
    
    // スプシから取得済みの数値に更新
    if (memberData[currentMember]) {
        inputTr.value = memberData[currentMember];
    }
    
    sy();
}

// 以前の sy, calc, rs などの関数はそのまま下に続ける