<!-- $theme: default -->

# Ember.js

Behind the scenes

---

## Summary

* 対象者
* Emberとは
* Ember.jsの各コンポーネントの役割の説明
  * Router Route Template Controller
  * Model Serializer Adapter Store
  * Service
  * Initializer
  * Component
* 実例をもとに上記を説明
  * Rails developerが混乱するところも

---


## 対象者

* Ember.jsでWebアプリをEmber-CLIを使って開発したことがある方

---

## Ember

* CoCがあるフレームワーク
* CoCを求めているならEmberは候補に入れてもいいはず！
* でも、CoC = 暗黙知な時がある
* 今日はそれについて、初心者(今でも初心者だけど)の私がハマった経験から、Emberではこうやる(Ember Way)というのを説明していきます
* RailsのMVCは忘れましょう(違うものです)


---

## Router

* 各URL(Route)の定義を行う
* Railsでいう `config/routes.rb` に相当
* Routeの定義をすると、Route/Controllerも作られる
* Railsとは違いコードは作成されず、メモリ上に展開される

---

## Route

* 各URL毎に存在する
* 暗黙的に作られるRouteがある(index)
* Emberを理解するには、まずRouteをしっかり理解する必要がある
* Routeを `router.js` で定義するとCoCで該当するRouteとControllerは作成される
  * RouteとControllerはファイルが存在しない(定義されていない)場合は、Emberのデフォルトのものが使われる
  * CoCに該当するTemplateファイルは必須

---

### Routeの役割

* サーバからAjaxでデータ(Model)をロード
* モデルをコントローラにセットしテンプレート上で参照できるようにする
* テンプレートの描画
* 画面の遷移に応じたフックメソッドがある
  * URLのクエリの変更を検知しデータをリロードした
* マウスクリックなどのイベントからアクションを実行する
* RailsのController部分の一部を担当している

---

## 例1 テンプレート描画の流れ


* `ember new $app_name`
* `ember s`
* `open http://localhost:4200/`

![](./graphs/sample-01.mmd.png)

---

### behind the scenes

```js
Ember.Route.extend({
  renderTemplate() {
    this.render('application');
  },
});
```

```js
// app/routes/index.js
Ember.Route.extend({
  renderTemplate() {
    this.render('index', {
      into: 'application',
      outlet: 'main',
      controller: 'index',
    });
  },
});
```

---

## 例2 Routeを1つ定義してみる


```js
// app/router.js
Ember.Router.map(function() {
  this.route('hello-world');
});
```

* http://localhost:4200/hello-world/

---

