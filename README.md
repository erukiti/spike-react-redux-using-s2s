# spike-react-redux-using-s2s

s2sを使ったElectron + React + Redux の開発フローを自分なりに模索中。

## 使い方

* actions.tsとreducers.tsは自動生成
* react-reduxでいうところのcontainer単位でディレクトリを作成 (ex. app)
* app/index.ts を作成すると、ディレクトリ名に応じた変数を持つテンプレート展開
* app/action.ts にメソッドをはやすと、actions.tsに反映
* app/reducer.ts のinitialStateにメンバーを追加
* actions.ts で増えたアクションを reducer に追加

## s2s-handler-meta-rule

メタプログラミングを少しでも簡単にしたいなーと思って実験中。
たぶんプロジェクトごとに、ファイル名だったり色々な仕組みが変わるので、
そこらへんをメタルールとして./scripts/下に配置すればいい感じに自動生成とか走るといいなという感じで

