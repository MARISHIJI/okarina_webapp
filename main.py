import os
from music21 import stream, note, clef, environment

# --------------------------------------------------------------------------
# 1. MuseScore 4 の場所を指定する設定
# --------------------------------------------------------------------------
env = environment.Environment()
env['musicxmlPath'] = '/Applications/MuseScore 4.app/Contents/MacOS/mscore'
env['musescoreDirectPNGPath'] = '/Applications/MuseScore 4.app/Contents/MacOS/mscore'

# --------------------------------------------------------------------------
# 2. HTMLのJavaScriptから定義をコピー
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
# 3. オカリナの音名をmusic21が認識できる音名に変換する対応表
# --------------------------------------------------------------------------
NOTE_MAP = {
    'A': 'A4', 'A#': 'A#4', 'Bb': 'B-4', 'B': 'B4', 'C': 'C5', 'C#': 'C#5', 'Db': 'D-5',
    'D': 'D5', 'D#': 'D#5', 'Eb': 'E-5', 'E': 'E5', 'F': 'F5', 'F#': 'F#5', 'Gb': 'G-5',
    'G': 'G5', 'G#': 'G#5', 'Ab': 'A-5', 'A2': 'A5', 'A#2': 'A#5', 'Bb2': 'B-5', 'B2': 'B5',
    'C2': 'C6', 'C#2': 'C#6', 'Db2': 'D-6', 'D2': 'D6', 'D#2': 'D#6', 'Eb2': 'E-6',
    'E2': 'E6', 'F2': 'F6'
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

        s = stream.Stream()
        s.append(clef.TrebleClef())
        n = note.Note(NOTE_MAP[key])
        n.duration.type = 'whole'
        s.append(n)

        # --- ▼▼▼ ここからが修正箇所 ▼▼▼ ---
        # music21に自動で小節と拍子記号を作成させる
        s.makeMeasures(inPlace=True)
        
        # 作成された拍子記号を取得して「非表示」に設定する
        ts = s.getTimeSignatures()[0]
        ts.style.hideObjectOnPrint = True

        # 作成された小節線（左右の縦線）もすべて「非表示」に設定する
        for bar in s.recurse().getElementsByClass('Barline'):
            bar.style.hideObjectOnPrint = True
        # --- ▲▲▲ ここまでが修正箇所 ▲▲▲ ---

        filepath = os.path.join(output_dir, filename)
        try:
            s.write('musicxml.png', fp=filepath)
            print(f"✅ {filename} を生成しました。")
        except Exception as e:
            print(f"❌ {filename} の生成に失敗しました。エラー: {e}")
    
    # --- 空の五線譜を生成 ---
    print("\n空の五線譜画像を生成します...")
    s_blank = stream.Stream()
    s_blank.append(clef.TrebleClef())
    s_blank.append(note.Rest(type='whole')) # 適切な余白のため休符を置く

    # 空の五線譜にも同様に非表示処理を適用
    s_blank.makeMeasures(inPlace=True)
    for bar in s_blank.recurse().getElementsByClass('Barline'):
        bar.style.hideObjectOnPrint = True

    filepath_blank = os.path.join(output_dir, STAFF_BLANK)
    try:
        s_blank.write('musicxml.png', fp=filepath_blank)
        print(f"✅ {STAFF_BLANK} を生成しました。")
    except Exception as e:
        print(f"❌ {STAFF_BLANK} の生成に失敗しました。エラー: {e}")

    print("\nすべての処理が完了しました。")

# --- スクリプトを実行 ---
if __name__ == '__main__':
    # 既存のimgフォルダ内の古い画像を削除してから生成開始
    if os.path.exists('img'):
        print("既存のimgフォルダ内の古い画像を削除します...")
        for f in os.listdir('img'):
            os.remove(os.path.join('img', f))
    
    generate_images()