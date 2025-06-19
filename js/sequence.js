/* ========= Web Audio & Data ========= */
let audioContext;
try { audioContext = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { console.error('Web Audio API unsupported'); }
const OCARINA_RANGE = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#','A2','A#2','B2','C2','C#2','D2','D#2','E2','F2'];
const NOTE_FREQUENCIES = {'A':440,'A#':466.16,'B':493.88,'C':523.25,'C#':554.37,'D':587.33,'D#':622.25,'E':659.25,'F':698.46,'F#':739.99,'G':783.99,'G#':830.61,'A2':880,'A#2':932.33,'B2':987.77,'C2':1046.5,'C#2':1108.73,'D2':1174.66,'D#2':1244.51,'E2':1318.51,'F2':1396.91};
const NOTE_TO_INDEX = Object.fromEntries(OCARINA_RANGE.map((n,i) => [n,i]));
const INPUT_TO_NOTE = {
    'ら':'A','ら#':'A#','ら♯':'A#','し':'B','ど':'C','ど#':'C#','ど♯':'C#','れ':'D','れ#':'D#','れ♯':'D#','み':'E','ふぁ':'F','ふぁ#':'F#','ふぁ♯':'F#','そ':'G','そ#':'G#','そ♯':'G#',
    'ら2':'A2','ら#2':'A#2','ら♯2':'A#2','し2':'B2','ど2':'C2','ど#2':'C#2','ど♯2':'C#2','れ2':'D2','れ#2':'D#2','れ♯2':'D#2','み2':'E2','ふぁ2':'F2',
    'らhi':'A2',  'らHi':'A2',  'らHI':'A2','ら#hi':'A#2', 'ら#Hi':'A#2', 'ら#HI':'A#2','ら♯hi':'A#2', 'ら♯Hi':'A#2', 'ら♯HI':'A#2','しhi':'B2',  'しHi':'B2',  'しHI':'B2','どhi':'C2',  'どHi':'C2',  'どHI':'C2','ど#hi':'C#2', 'ど#Hi':'C#2', 'ど#HI':'C#2','ど♯hi':'C#2', 'ど♯Hi':'C#2', 'ど♯HI':'C#2','れhi':'D2',  'れHi':'D2',  'れHI':'D2','れ#hi':'D#2', 'れ#Hi':'D#2', 'れ#HI':'D#2','れ♯hi':'D#2', 'れ♯Hi':'D#2', 'れ♯HI':'D#2','みhi':'E2',  'みHi':'E2',  'みHI':'E2','ふぁhi':'F2',  'ふぁHi':'F2',  'ふぁHI':'F2',
    'ラ':'A','ラ#':'A#','ラ♯':'A#','シ':'B','ド':'C','ド#':'C#','ド♯':'C#','レ':'D','レ#':'D#','レ♯':'D#','ミ':'E','ファ':'F','ファ#':'F#','ファ♯':'F#','ソ':'G','ソ#':'G#','ソ♯':'G#',
    'ラ2':'A2','ラ#2':'A#2','ラ♯2':'A#2','シ2':'B2','ド2':'C2','ド#2':'C#2','ド♯2':'C#2','レ2':'D2','レ#2':'D#2','レ♯2':'D#2','ミ2':'E2','ファ2':'F2',
    'ラhi':'A2',  'ラHi':'A2',  'ラHI':'A2','ラ#hi':'A#2', 'ラ#Hi':'A#2', 'ラ#HI':'A#2','ラ♯hi':'A#2', 'ラ♯Hi':'A#2', 'ラ♯HI':'A#2','シhi':'B2',  'シHi':'B2',  'シHI':'B2','ドhi':'C2',  'ドHi':'C2',  'ドHI':'C2','ド#hi':'C#2', 'ド#Hi':'C#2', 'ド#HI':'C#2','ド♯hi':'C#2', 'ド♯Hi':'C#2', 'ド♯HI':'C#2','レhi':'D2',  'レHi':'D2',  'レHI':'D2',
    'レ#hi':'D#2', 'レ#Hi':'D#2', 'レ#HI':'D#2','レ♯hi':'D#2', 'レ♯Hi':'D#2', 'レ♯HI':'D#2',
    'ミhi':'E2',  'ミHi':'E2',  'ミHI':'E2','ファhi':'F2',  'ファHi':'F2',  'ファHI':'F2',
    'A':'A','A#':'A#','BB':'A#','B':'B','C':'C','C#':'C#','DB':'C#','D':'D','D#':'D#','EB':'D#','E':'E','F':'F','F#':'F#','GB':'F#','G':'G','G#':'G#','AB':'G#','A2':'A2','A#2':'A#2','BB2':'A#2','B2':'B2','C2':'C2','C#2':'C#2','DB2':'C#2','D2':'D2','D#2':'D#2','EB2':'D#2','E2':'E2','F2':'F2',
    'Bb':'A#', 'B♭':'A#', 'Db':'C#', 'D♭':'C#', 'Eb':'D#', 'E♭':'D#', 'Gb':'F#', 'G♭':'F#', 'Ab':'G#', 'A♭':'G#',
    'Bb2':'A#2', 'B♭2':'A#2', 'Db2':'C#2', 'D♭2':'C#2', 'Eb2':'D#2', 'E♭2':'D#2'
};
const NOTE_TO_DISPLAY = {
    'A':'ラ', 'A#':'ラ♯', 'B':'シ', 'C':'ド', 'C#':'ド♯', 'D':'レ', 'D#':'レ♯', 'E':'ミ', 'F':'ファ', 'F#':'ファ♯', 'G':'ソ', 'G#':'ソ♯',
    'A2':'ラHi', 'A#2':'ラ♯Hi', 'B2':'シHi', 'C2':'ドHi', 'C#2':'ド♯Hi', 'D2':'レHi', 'D#2':'レ♯Hi', 'E2':'ミHi', 'F2':'ファHi'
};
const IMG_PATH = './img/';
const FINGERING_IMG = {'A':'fingering_A.png','A#':'fingering_As.png','B':'fingering_B.png','C':'fingering_C.png','C#':'fingering_Cs.png','D':'fingering_D.png','D#':'fingering_Ds.png','E':'fingering_E.png','F':'fingering_F.png','F#':'fingering_Fs.png','G':'fingering_G.png','G#':'fingering_Gs.png','A2':'fingering_A2.png','A#2':'fingering_As2.png','B2':'fingering_B2.png','C2':'fingering_C2.png','C#2':'fingering_Cs2.png','D2':'fingering_D2.png','D#2':'fingering_Ds2.png','E2':'fingering_E2.png','F2':'fingering_F2.png'};
const SHARP_TO_FLAT = {'A#':'Bb','C#':'Db','D#':'Eb','F#':'Gb','G#':'Ab','A#2':'Bb2','C#2':'Db2','D#2':'Eb2'};
const AMBIGUOUS_NOTE_MAP = {};
OCARINA_RANGE.forEach(note => {
    const baseWithSharp = note.replace('2', '');
    if (!AMBIGUOUS_NOTE_MAP[baseWithSharp]) AMBIGUOUS_NOTE_MAP[baseWithSharp] = [];
    AMBIGUOUS_NOTE_MAP[baseWithSharp].push(note);
});

/* ========= DOM ========= */
const pianoRoot = document.getElementById('piano');
const keyFingeringDisplay = document.getElementById('key-fingering-display');
const keyboardSection = document.getElementById('keyboard-section');
const seqInput = document.getElementById('seq-input');
const boardSeq = document.getElementById('board-seq');
const transposeControls = document.getElementById('transpose-controls');
const transposeLevel = document.getElementById('transpose-level');
const transposeUp = document.getElementById('transpose-up');
const transposeDown = document.getElementById('transpose-down');
const toggleKeyboardBtn = document.getElementById('toggle-keyboard-btn');
const mobilePrevBtn = document.getElementById('mobile-prev-btn');
const mobileNextBtn = document.getElementById('mobile-next-btn');
const helpIcon = document.getElementById('help-icon');
const helpBubble = document.getElementById('help-bubble');

/* ========= 状態 ========= */
let currentSequenceIndex = null;
let originalSequence = [];
let transposition = 0;

/* ========= Audio ========= */
function playNote(freq, dur = 0.45) {
    if (!audioContext || !freq) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + dur);
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + dur);
}

/* ========= UI Helper ========= */
function createCard(note, label) {
    const wrap = document.createElement('div');
    wrap.className = 'card';
    const lbl = document.createElement('div');
    lbl.className = 'note-label';
    lbl.textContent = label;

    if (note && note !== 'REST') {
        const baseWithSharp = note.replace('2', '');
        const octaveOptions = AMBIGUOUS_NOTE_MAP[baseWithSharp];
        if (octaveOptions && octaveOptions.length > 1) {
            if (note.includes('2')) {
                lbl.style.color = 'var(--high-octave-color)';
            } else {
                lbl.style.color = 'var(--low-octave-color)';
            }
        }
    }

    if (note === 'REST' || note === null) { // nullもここで処理
        wrap.classList.add('rest-card');
        if (note === 'REST') {
            lbl.style.color = 'var(--text-light-color)';
        } else {
            lbl.style.color = '#888'; // 音域外などのメッセージ用
        }
        wrap.appendChild(lbl);
        return wrap;
    }
    const img = document.createElement('img');
    img.onerror = () => { img.style.display = 'none'; lbl.style.color = '#888'; lbl.textContent += ' (画像なし)'; };
    if (note && FINGERING_IMG[note]) { img.src = IMG_PATH + FINGERING_IMG[note]; img.alt = ``; } else { img.style.display = 'none'; }
    wrap.appendChild(lbl); wrap.appendChild(img);
    return wrap;
}

/* --- 独立キーボード用の機能 --- */
function highlightPianoKeys(note) {
    pianoRoot.querySelectorAll('.white-key, .black-key').forEach(k => k.classList.toggle('active', k.dataset.note === note));
}

function renderSingle(note) {
    const finalNote = transposeNote(note, transposition);
    highlightPianoKeys(note);
    keyFingeringDisplay.innerHTML = '';

    if (!finalNote) {
        const card = createCard(null, '音域外');
        keyFingeringDisplay.appendChild(card);
        return;
    }
    
    const disp = NOTE_TO_DISPLAY[finalNote] || finalNote;
    const card = createCard(finalNote, disp);
    keyFingeringDisplay.appendChild(card);
    playNote(NOTE_FREQUENCIES[finalNote]);
}

/* --- ピアノ生成ロジック --- */
function buildPiano() {
    const wasVisible = keyboardSection.classList.contains('visible');
    if (!wasVisible) {
        keyboardSection.style.visibility = 'hidden';
        keyboardSection.classList.add('visible');
    }
    pianoRoot.innerHTML = '';
    const whiteKeysData = OCARINA_RANGE.filter(n => !n.includes('#'));
    const blackKeysData = OCARINA_RANGE.filter(n => n.includes('#'));
    const whiteKeyElements = {};
    const noteToDoremi = { 'C': 'ド', 'D': 'レ', 'E': 'ミ', 'F': 'ファ', 'G': 'ソ', 'A': 'ラ', 'B': 'シ' };

    whiteKeysData.forEach(noteName => {
        const el = document.createElement('div');
        el.className = 'white-key';
        el.dataset.note = noteName;
        el.addEventListener('click', () => renderSingle(noteName));
        const baseNote = noteName.replace(/[0-9]/, '');
        const doremiText = noteToDoremi[baseNote];
        if (doremiText) {
            const label = document.createElement('div');
            label.className = 'key-label';
            label.textContent = doremiText;
            el.appendChild(label);
        }
        pianoRoot.appendChild(el);
        whiteKeyElements[noteName] = el;
    });

    blackKeysData.forEach(noteName => {
        const parentWhiteKeyName = noteName.replace('#', '');
        const parentElement = whiteKeyElements[parentWhiteKeyName] || whiteKeyElements[parentWhiteKeyName.slice(0, -1)];
        if (parentElement) {
            const blackKeyElement = document.createElement('div');
            blackKeyElement.className = 'black-key';
            blackKeyElement.dataset.note = noteName;
            const whiteKeyWidth = 36;
            const blackKeyWidth = 24;
            blackKeyElement.style.left = `${parentElement.offsetLeft + whiteKeyWidth - (blackKeyWidth / 2)}px`;
            blackKeyElement.addEventListener('click', e => {
                e.stopPropagation();
                renderSingle(noteName);
            });
            pianoRoot.appendChild(blackKeyElement);
        }
    });

    if (!wasVisible) {
        keyboardSection.classList.remove('visible');
        keyboardSection.style.visibility = 'visible';
    }
}

/* ========= Sequence Mode (テキスト入力関連) ========= */
const ESCAPED_KEYS = Object.keys(INPUT_TO_NOTE).sort((a,b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

function transposeNote(note, step) {
    if (note === 'REST' || note === 'LINEBREAK') return note;
    const idx = NOTE_TO_INDEX[note];
    if (idx === undefined) return null;
    const newIdx = idx + step;
    if (newIdx < 0 || newIdx >= OCARINA_RANGE.length) return null;
    return OCARINA_RANGE[newIdx];
}

/* --- スクロールと再生機能 --- */
function selectSequenceNote(index, playSound = true) {
    if (index < 0 || index >= originalSequence.length) return;
    currentSequenceIndex = index;
    let cardIndex = 0;
    let dataIndex = 0;
    while(dataIndex < index) {
        if(originalSequence[dataIndex].note !== 'LINEBREAK') cardIndex++;
        dataIndex++;
    }
    const cards = boardSeq.querySelectorAll('.card');
    cards.forEach((c, i) => c.classList.toggle('active', i === cardIndex));

    const activeCard = cards[cardIndex];
    if (activeCard) {
        activeCard.scrollIntoView({
            behavior: 'auto',
            block: 'center'
        });
    }

    const item = originalSequence[index];
    if (item.note === 'REST' || item.note === 'LINEBREAK') return;
    const tNote = transposeNote(item.note, transposition);
    
    if (tNote && playSound) {
        playNote(NOTE_FREQUENCIES[tNote]);
    }
}

function renderTransposedSequence() {
    boardSeq.innerHTML = '';
    const lastValidIndex = currentSequenceIndex;

    if (originalSequence.length === 0) {
        transposeControls.style.display = 'none';
        return;
    }
    transposeControls.style.display = 'flex';
    transposeLevel.textContent = `Key: ${transposition > 0 ? '+' : ''}${transposition}`;
    
    originalSequence.forEach((item, index) => {
        let card;
        if (item.note === 'LINEBREAK') {
            const brEl = document.createElement('div');
            brEl.style.gridColumn = '1 / -1';
            brEl.style.height = '0';
            boardSeq.appendChild(brEl);
            return;
        }
        if (item.note === 'REST') {
            card = createCard('REST', '休');
        } else {
            const tNote = transposeNote(item.note, transposition);
            if (tNote) {
                const disp = NOTE_TO_DISPLAY[tNote] || tNote;
                const lbl = item.lyric ? `${disp}（${item.lyric}）` : disp;
                card = createCard(tNote, lbl);
            } else {
                const lbl = item.lyric ? `音域外（${item.lyric}）` : '音域外';
                card = createCard(null, lbl);
            }
        }
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => selectSequenceNote(index, true));
        
        const changeOctave = (e) => {
            e.preventDefault();
            const currentItem = originalSequence[index];
            if (currentItem.note === 'REST' || currentItem.note === 'LINEBREAK') return;
            const currentNote = currentItem.note;
            const baseNote = currentNote.replace('2', '');
            const octaveOptions = AMBIGUOUS_NOTE_MAP[baseNote];
            if (octaveOptions && octaveOptions.length > 1) {
                const currentIndexInOptions = octaveOptions.indexOf(currentNote);
                const nextIndex = (currentIndexInOptions + 1) % octaveOptions.length;
                originalSequence[index].note = octaveOptions[nextIndex];
                renderTransposedSequence();
            }
        };
        card.addEventListener('contextmenu', changeOctave);
        card.addEventListener('dblclick', changeOctave);

        boardSeq.appendChild(card);
    });

    if (lastValidIndex !== null && lastValidIndex < originalSequence.length) {
        selectSequenceNote(lastValidIndex, false);
    }
}

function parseAndResolveSequence(rawText) {
    if (!rawText.trim()) return [];
    const tokenRegex = new RegExp(`(${ESCAPED_KEYS.join('|')})(?:（([^）]+)）)?|([ 　]+)|(\\n)`, 'gi');
    const matches = [...rawText.matchAll(tokenRegex)];
    if (matches.length === 0) {
        boardSeq.innerHTML = '<p style="grid-column:1/-1;color:var(--text-light-color);">認識できる音名がありませんでした。</p>';
        return [];
    }

    const resolvedSequence = matches.map(m => {
        const [_, noteToken, lyricToken, spaceToken, newlineToken] = m;
        if (newlineToken) return { note: 'LINEBREAK' };
        if (spaceToken) return { note: 'REST' };
        const noteName = (noteToken || '').toUpperCase().replace('♭', 'b').replace('♯', '#');
        let note = INPUT_TO_NOTE[noteName] || INPUT_TO_NOTE[noteToken];
        if (!note) return null;

        const potentialNotes = AMBIGUOUS_NOTE_MAP[note.replace('2', '')];
        const isOctaveExplicitlySpecified = /[2２hHiI]/.test(noteToken);

        if (potentialNotes && potentialNotes.length > 1 && !isOctaveExplicitlySpecified) {
            note = potentialNotes[0];
        }
        
        return { note: note, lyric: lyricToken || '' };
    }).filter(Boolean);

    return resolvedSequence;
}

function updateApp() {
    const rawText = seqInput.value;
    const newUrl = rawText.trim()
        ? `${window.location.pathname}?sequence=${encodeURIComponent(rawText)}`
        : window.location.pathname;
    history.replaceState({ sequence: rawText }, '', newUrl);
    originalSequence = parseAndResolveSequence(rawText);
    currentSequenceIndex = null;
    renderTransposedSequence();
}

function navigateSequence(direction) {
    if (currentSequenceIndex === null) {
        if (direction === 1) {
            currentSequenceIndex = -1;
        } else {
            currentSequenceIndex = originalSequence.length;
        }
    }
    
    let nextIndex = currentSequenceIndex;
    do {
        nextIndex += direction;
    } while (
        nextIndex >= 0 &&
        nextIndex < originalSequence.length &&
        (originalSequence[nextIndex].note === 'REST' || originalSequence[nextIndex].note === 'LINEBREAK')
    );

    if (nextIndex >= 0 && nextIndex < originalSequence.length) {
        selectSequenceNote(nextIndex, true);
    }
}

/* ========= イベントリスナー ========= */
transposeUp.addEventListener('click', () => { transposition++; renderTransposedSequence(); });
transposeDown.addEventListener('click', () => { transposition--; renderTransposedSequence(); });

mobilePrevBtn.addEventListener('click', () => navigateSequence(-1));
mobileNextBtn.addEventListener('click', () => navigateSequence(1));

document.addEventListener('keydown', e => {
    if (document.activeElement === seqInput) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSequence(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSequence(1);
    }
});

window.addEventListener('load', () => {
    buildPiano();
    const params = new URLSearchParams(window.location.search);
    const sequence = params.get('sequence');
    if (sequence) {
        seqInput.value = decodeURIComponent(sequence);
    }
    transposition = 0;
    updateApp();
});

seqInput.addEventListener('input', updateApp);

toggleKeyboardBtn.addEventListener('click', () => {
    keyboardSection.classList.toggle('visible');
    if (keyboardSection.classList.contains('visible')) {
        toggleKeyboardBtn.textContent = 'キーボードを非表示';
    } else {
        toggleKeyboardBtn.textContent = 'キーボードを表示';
        highlightPianoKeys(null);
    }
});

helpIcon.addEventListener('click', (event) => {
    // 親要素へのイベント伝播を停止し、documentのクリックイベントが発火しないようにする
    event.stopPropagation();
    // 吹き出しの表示・非表示を切り替える
    helpBubble.classList.toggle('visible');
});

// 吹き出しの外側をクリックしたときに閉じる処理
document.addEventListener('click', (event) => {
    // 吹き出しが表示されていて、かつクリックした場所がアイコンや吹き出しの内部でない場合
    if (helpBubble.classList.contains('visible') && !helpIcon.contains(event.target) && !helpBubble.contains(event.target)) {
        helpBubble.classList.remove('visible');
    }
});