# mini-draw

mini-draw は軽量でシンプルなお絵描きツールです。基本的な機能に焦点を当て、デジタルスケッチやアイデア出しが簡単にできるよう設計されています。

## 特徴

- **軽量**：必要最低限の機能のみを搭載しているため、軽量で高速です。
- **使いやすい**：シンプルなインターフェースで、直感的に利用できます。
- **Vanilla JS**：外部ライブラリに依存せず、純粋な JavaScript だけで実装されています。

## 機能

- **鉛筆モード**：自由に描画できるツールで、鉛筆の色と太さを変更できます。
- **バケツモード**：指定した領域をクリックして色を塗りつぶすツールです。
- **消しゴムモード**：描画を部分的に消去できるツールで、消しゴムの大きさを調整できます。
- **背景色変更モード**：キャンバスの背景色を変更できます。
- **元に戻す**：描画内容を一つ前の状態に戻せます。

## デモ

<a href="https://mini-draw.pages.dev/" target="_blank">mini-draw のデモを見る</a>

## インストールと使い方

### 基本的な使い方

1. `mini-draw.umd.js`スクリプトを HTML ファイルに追加します。

2. Mini Draw ウィジェットを挿入したい場所にコンテナ要素を作成します。例:

   ```html
   <div id="app"></div>
   ```

3. `MiniDraw.init()`を呼び出して、コンテナ要素の ID を渡します:

   ```html
   <script src="path/to/mini-draw.umd.js"></script>
   <script>
     MiniDraw.init("app");
   </script>
   ```

   `MiniDraw.init()` にオプションを渡すことで、ウィジェットをカスタマイズできます。利用可能なオプションは以下の通りです：

   - `canvasWidth` (number): 描画領域の幅をピクセル単位で指定します。デフォルトは `340` です。
   - `canvasHeight` (number): 描画領域の高さをピクセル単位で指定します。デフォルトは `340` です。
   - `pencilColor` (string): 鉛筆の色を 16 進数形式で指定します。デフォルトは `#000000` です。
   - `bgColor` (string): 描画領域の背景色を 16 進数形式で指定します。デフォルトは `#FFFFEF` です。
   - `thickness` (number): 鉛筆の太さをピクセル単位で指定します。デフォルトは `1` です。
   - `eraserSize` (number): 消しゴムのサイズをピクセル単位で指定します。デフォルトは `20` です。

   オプションを使う例は次の通りです:

   ```html
   <script src="path/to/mini-draw.umd.js"></script>
   <script>
     MiniDraw.init("app", {
       canvasWidth: 500,
       canvasHeight: 400,
       pencilColor: "#FF0000",
       bgColor: "#FFFFFF",
       thickness: 2,
       eraserSize: 30,
     });
   </script>
   ```

オブションを使った場合の HTML ファイル全体は次のようになります:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini Draw</title>
  </head>

  <body>
    <div id="app"></div>
    <script src="path/to/mini-draw.umd.js"></script>
    <script>
      MiniDraw.init("app", {
        canvasWidth: 500,
        canvasHeight: 400,
        pencilColor: "#FF0000",
        bgColor: "#FFFFFF",
        thickness: 2,
        eraserSize: 30,
      });
    </script>
  </body>
</html>
```

### 開発環境のセットアップ

コードを修正したりプロジェクトに貢献したりする場合は、次の手順で開発環境をセットアップします:

1. リポジトリをクローンします:

   ```bash
   git clone https://github.com/takatama/mini-draw.git
   ```

2. プロジェクトディレクトリに移動します:

   ```bash
   cd mini-draw
   ```

3. 依存関係をインストールします:

   ```bash
   npm install
   ```

4. Vite で開発サーバーを起動します:

   ```bash
   npm run dev
   ```

5. ブラウザで`http://localhost:5173`を開いて、アプリを確認します。

### プロダクション用ビルド

プロジェクトをプロダクション用にビルドするには、次のコマンドを実行します:

```bash
npm run build
```

これにより、`dist`ディレクトリにビルドファイルが作成されます。

### ビルドのテスト

ローカルでプロダクションビルドをテストするには、提供されたテストセットアップを使用します:

1. ビルドプロセスが完了しており、`dist`ディレクトリにビルドファイルが含まれていることを確認します。

2. `test`ディレクトリに移動します:

   ```bash
   cd test
   ```

3. ブラウザで`index.html`を開き、ビルド済みの`mini-draw.umd.js`が正しく動作することを確認します。

## 使用技術

- HTML5 Canvas
- JavaScript (Vanilla JS)

## 貢献

バグ報告や機能追加の提案は、[Issues](https://github.com/takatama/mini-draw/issues) で受け付けています。プルリクエストも大歓迎です！

## ライセンス

このプロジェクトは、MIT ライセンスの下で公開されています。詳細については、[LICENSE](LICENSE)ファイルを参照してください。
