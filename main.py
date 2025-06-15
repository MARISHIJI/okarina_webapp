import os
from music21 import stream, note, clef, environment, meter, bar # meterとbarを追加

# --------------------------------------------------------------------------
# 1. MuseScore 4 の場所を指定する設定 (環境に合わせて変更してください)
# --------------------------------------------------------------------------
env = environment.Environment()
# Macの場合の例
env['musicxmlPath'] = '/Applications/MuseScore 4.app/Contents/MacOS/mscore'
env['musescoreDirectPNGPath'] = '/Applications/MuseScore 4.app/Contents/MacOS/mscore'
# Windowsの場合の例 (ご自身のインストール場所を確認してください)
# env['musicxmlPath'] = r'C:\Program Files\MuseScore 4\bin\MuseScore4.exe'
# env['musescoreDirectPNGPath'] = r'C:\Program Files\MuseScore 4\bin\MuseScore4.exe'

# --------------------------------------------------------------------------
# 2. ファイル名の定義
# --------------------------------------------------------------------------
STAFF_IMG = {
    'A':'staff_A.png', 'A#':'staff_As.png', 'Bb':'staff_Bb.png', 'B':'staff_B.png',
    'C':'staff_C.png', 'C#':'staff_Cs.png', 'Db':'staff_Db.png', 'D':'staff_D.png',
    'D#':'staff_Ds.png', 'Eb':'staff_Eb.png', 'E':'staff_E.png', 'F':'staff_F.png',
    'F#':'staff_Fs.png', 'Gb':'staff_Gb.png', 'G':'staff_G.png', 'G#':'staff_Gs.png',
    'Ab':'staff_Ab.png', 'A2':'staff_A2.png', 'A#2':'staff_As2.png', 'Bb2':'staff_Bb2.png',
    'B2':'staff_B2.png', 'C2':'staff_C2.png', 'C#2':'staff_Cs2.png', 'Db2':'staff_Db2.png',
    'D2':'staff_D2.png', 'D#2':'staff_Ds2.png', 'Eb2':'staff_Eb2.png', 'E2':'staff_E2.png',
    'F2':'staff_F2.png'
}
STAFF_BLANK = 'staff_blank.png'

# --------------------------------------------------------------------------
# 3. 音名の対応表（1オクターブ低い状態）
# --------------------------------------------------------------------------
NOTE_MAP = {
    'A': 'A3', 'A#': 'A#3', 'Bb': 'B-3', 'B': 'B3', 'C': 'C4', 'C#': 'C#4', 'Db': 'D-4',
    'D': 'D4', 'D#': 'D#4', 'Eb': 'E-4', 'E': 'E4', 'F': 'F4', 'F#': 'F#4', 'Gb': 'G-4',
    'G': 'G4', 'G#': 'G#4', 'Ab': 'A-4', 'A2': 'A4', 'A#2': 'A#4', 'Bb2': 'B-4', 'B2': 'B4',
    'C2': 'C5', 'C#2': 'C#5', 'Db2': 'D-5', 'D2': 'D5', 'D#2': 'D#5', 'Eb2': 'E-5',
    'E2': 'E5', 'F2': 'F5'
}

# --------------------------------------------------------------------------
# 4. 画像を生成するメインの処理
# --------------------------------------------------------------------------
def generate_images():
    """必要な五線譜画像をすべて生成する"""
    output_dir = 'img'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"'{output_dir}' フォルダを作成しました。")

    # --- 各音符の五線譜を生成 ---
    print("\n各音符の五線譜画像を生成します...")
    for key, filename in STAFF_IMG.items():
        if key not in NOTE_MAP:
            print(f"警告: '{key}' の音符マッピングが見つかりません。スキップします。")
            continue
        
        # ▼▼▼ ここからが修正箇所 ▼▼▼
        # Score, Part, Measureという階層で楽譜を明示的に作成する
        s = stream.Score()
        p = stream.Part()
        m = stream.Measure() # 1小節だけを作成

        # 拍子記号を作成し、「非表示」に設定
        ts = meter.TimeSignature('4/4')
        ts.style.hideObjectOnPrint = True
        m.append(ts)
        
        m.append(clef.TrebleClef())
        
        n = note.Note(NOTE_MAP[key])
        n.duration.type = 'whole'
        m.append(n)
        
        # 小節の右端の縦線を「なし」に設定
        m.rightBarline = bar.Barline('none')
        
        p.append(m)
        s.append(p)
        # ▲▲▲ ここまでが修正箇所 ▲▲▲

        filepath = os.path.join(output_dir, filename)
        try:
            s.write('musicxml.png', fp=filepath)
            print(f"✅ {filename} を生成しました。")
        except Exception as e:
            print(f"❌ {filename} の生成に失敗しました。エラー: {e}")
    
    # --- 空の五線譜を生成 ---
    print("\n空の五線譜画像を生成します...")
    s_blank = stream.Score()
    p_blank = stream.Part()
    m_blank = stream.Measure()
    
    # こちらも同様に、拍子記号を非表示に
    ts_blank = meter.TimeSignature('4/4')
    ts_blank.style.hideObjectOnPrint = True
    m_blank.append(ts_blank)
    
    m_blank.append(clef.TrebleClef())
    
    # 幅を確保するために「非表示の」全休符を置く
    r = note.Rest(type='whole')
    r.style.hideObjectOnPrint = True
    m_blank.append(r)
    
    # 右端の縦線をなしに
    m_blank.rightBarline = bar.Barline('none')
    
    p_blank.append(m_blank)
    s_blank.append(p_blank)

    filepath_blank = os.path.join(output_dir, STAFF_BLANK)
    try:
        s_blank.write('musicxml.png', fp=filepath_blank)
        print(f"✅ {STAFF_BLANK} を生成しました。")
    except Exception as e:
        print(f"❌ {STAFF_BLANK} の生成に失敗しました。エラー: {e}")

    print("\nすべての処理が完了しました。")

# --- スクリプトを実行 ---
if __name__ == '__main__':    
    generate_images()