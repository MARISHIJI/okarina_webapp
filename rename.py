import os

# --- 設定 ---
# Trueにすると、ファイル名の変更はせず、何が変更されるかを表示するだけ（安全）
# Falseにすると、実際にファイル名を変更する
DRY_RUN = False

# 変更したい文字列
SEARCH_STRING = "-1"
# --- 設定ここまで ---

def rename_files_in_current_directory():
    """
    カレントディレクトリのファイル名から特定の文字列を削除する
    """
    if DRY_RUN:
        print("--- ドライランを開始します（ファイル名は変更されません） ---")
    else:
        print("--- ファイル名の変更を開始します ---")

    # カレントディレクトリのファイルとフォルダのリストを取得
    for filename in os.listdir('.'):
        # 取得したのがファイルであり、かつ名前に検索文字列が含まれているかを確認
        if os.path.isfile(filename) and SEARCH_STRING in filename:
            
            # 古いファイルパス
            old_path = os.path.join('.', filename)
            
            # 新しいファイル名を生成（SEARCH_STRINGを空文字に置換）
            new_filename = filename.replace(SEARCH_STRING, "")
            new_path = os.path.join('.', new_filename)
            
            # もし新しいファイル名が既に存在する場合は、上書き防止のためにスキップ
            if os.path.exists(new_path):
                print(f"⚠️  スキップ: 新しい名前 '{new_filename}' は既に存在します。")
                continue

            # ドライランか実実行かで処理を分岐
            if DRY_RUN:
                print(f"変更予定: '{filename}'  ->  '{new_filename}'")
            else:
                try:
                    os.rename(old_path, new_path)
                    print(f"✅ 変更完了: '{filename}'  ->  '{new_filename}'")
                except OSError as e:
                    print(f"❌ エラー: {filename} の変更に失敗しました。理由: {e}")

    print("--- 処理が完了しました ---")

# --- スクリプトの実行 ---
if __name__ == '__main__':
    rename_files_in_current_directory()