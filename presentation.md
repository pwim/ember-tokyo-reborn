# Ember.js

Second Step (Router and etc)


---

# お品書き

- Emberとは
- Ember.jsのCoC各コンポーネントの役割の説明
- 実例をもとに上記を説明
  - Rails developerが混乱するところもピックアップ

---


## 対象者

- Ember.jsでWebアプリをEmber-CLIを使って開発したことがあり、
- Emberのファイル構成を知っているが、
- いまいちEmberでのやり方がわからないという方
- Railsでいう `resources :post` をEmberでどうやるのかわからない方

---

## Ember

* CoCがあるフレームワーク
* CoCは知らないと逆に迷ったり分からなくなる
* 今回はそのCoCと各コンポーネント(MVCなど)を説明していきます
* RailsのMVCは忘れましょう(違うものです。時々違いを説明するけど)

^EmberはCoC convention over configuration(設定よりも規約)があるフレームワークです。
つまり、Emberで普通に開発していくには、まずこのCoCを知る必要があります。

---

## Emberのコンポーネント

- Router Route Template Controller
- Component
- Model Serializer Adapter Store
- Service
- Initializer
- etc... a lot!!

---

## 最初に知っておくべきもの

* Router
* Route
* Template
* Controller
* これらのCoCと役割
* Componentの使い方と活用方法
  * これはTemplateとControllerを知っていれば割と簡単 

---

## その次は

* Railsでいう `resources :posts` (CRUD) をEmberで実現する方法
* Routeの使い方と各Routeとの関係

今回のメイントピックです！

---

## さらにその次は

* Ember-DATA, Model, Store, Serializer, Adapter...
* Service, Initializer
* Ember.Object, Ember.RSVP.*, etc...

ひとまず、 **最初に知っておくべきもの** からやっつけていきましょう

---

## Router

* 各URL(Route)の定義を行う
* Railsでいう `config/routes.rb` に相当
* Routeの定義をすると、Route/Controllerも作られる
  * Railsとは違いRouteとControllerはコード存在しなくても良い
  * ない場合はデフォルトのものが使用される

---

## /hello-world

```js
// app/router.js
Ember.Router.map(function() {
  this.route('hello-world');
});
```

```hbs
{{!-- app/templates/hello-world.hbs --}}
<h1>Hello World</h1>
```

* http://localhost:4200/hello-world
* CoCに沿って、`app/templates/hello-world.hbs` が参照され、ブラウザにHello Worldと表示される

^
この仕組みはEmberを少し触ったことがある方はご存知かと思います。
hello-world routeを定義し、hello-world.hbsを作成すると、それ以外のコードを書かなくても、/hello-worldにアクセスすれば、hello-worold.hbsの中身が表示されます。
裏側で何が起きているかは後ほど説明します。
You might know this behavior if you aleady tried Ember.
Without writing other code, Ember will display Hello World on the browser when you access to /hello-world.
I'm going to talk about the background of this feature later.

---

## Template

* Handlebars
* Controllerのプロパティを表示したり
* HelperやComponentの使ったり
* `{{action}}` を使ってController/Routeに処理を任せる

---

### Actions


```hbs
{{!-- app/templates/application.hbs --}}
<form {{action "save" on="submit"}}>
{{input value=model.name}}
</form>
```

---

## Route

* 各URL毎に存在する
* 暗黙的に作られるRouteがある(index)
* Emberを理解するには、まずRouteをしっかり理解する必要がある

---

### Routeの役割

* テンプレートの描画
* テンプレート内の `{{action}}` を実行する
* 画面の遷移に応じたフックメソッドがある
  * 画面上に表示したいデータをAjaxで非同期で取ってきて表示させたり
  * URLのクエリ部分の変更を検知しデータをリロードした
* RailsのController部分の一部を担当している

---

### Handling Actions

```hbs
{{!-- app/templates/application.hbs --}}
<form {{action "save" on="submit"}}>
{{input value=model.name}}
</form>
```

```js
// app/routes/application.js
Ember.Route.extend({
  actions: {
    save() {
      this.get('controller.model').save();
    }
  }
});
```

---

## Controller

* RouteとTemplateの間に存在しているイメージ
* Template内で `{{foo}}` のように値を参照している場合、Controllerのプロパティが参照される
* Routeの `setupController` フックによって、`model` フックで取得したデータはControllerの `model` プロパティに格納される

---

## Controller

* Route同様Template内のアクションをハンドリングする
  * RouteよりControllerが優先される
  * Controller内にない場合はRouteに伝達される
* Controllerを使わなくて済むなら使わない方が良い

---

### Router, Route & Template

* シンプルな画面は、Routerでrouteの定義とtemplateさえあればOK
* 1画面、1route, 1template, 1controllerと捉えておいてOK
  * ただしネストがある

---

### Component

* ControllerとTemplateがRouteと切り離されて再利用しやすくなったものを捉えてもOK
* 画面上の小さな部品から少し大きめの複雑なものがある
  * Data Down Actions Up / Smart component
* `{{link-to}}` などEmberのビルトインコンポーネント
* 今回は触れません(時間的に無理かな...)

---

# 裏側に潜入

役者は揃ったので、Emberが裏側で何をしているのか、先ほどのHello World例も含めて見ていきます。

---

## 例1 テンプレート描画の流れ


* `ember new $app_name`
* `ember s`
* `open http://localhost:4200/`

---

* トップページにアクセスすると以下のように実行される

![inline](./graphs/sample-01.mmd.png)


---

### behind the scenes

こんなコードが裏で動いています(正確ではありません)

```js
// app/routes/application.js
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

### behind the scenes

```hbs
{{!-- app/templates/application.hbs --}}
<section>
  {{outlet}}
</section>
```


```hbs
{{!-- app/templates/index.hbs --}}
<h1>Index</h1>
```

```html
<!-- 出力: output -->
<section>
  <h1>Index</h1>
</section>
```

* `{{outlet}}` と `{{outlet 'main'}}` は同じ

---

## 例2 Routeを1つ定義してみる


```js
Ember.Router.map(function() {
  this.route('hello-world');
});
```


---

* `/hello-world` にアクセスすると以下のように実行される

![inline](./graphs/sample-02.mmd.png)

---

基本がわかったところで、さらに実践的なRouteを定義してみましょう

わからん、という方はEmber Inspectorとにらめっこしてください :bow:

---

## Nested Route

リポジトリの一覧と詳細、編集ページの構成例

| path | description |
| --- | --- |
| /repositories | リポジトリ一覧 |
| /repositories/new | リポジトリ新規作成 |
| /repositories/:id | リポジトリ詳細 |
| /repositories/:id/edit | リポジトリ編集 |

---

Rails / Ember

```ruby
# config/routes.rb
resources :repository,
          only: [:index, :show, :edit, :new]
```

＝

```js
// app/router.js
Ember.Router.map(function() {
  this.route('repositories', function() {
    this.route('new');
    this.route('repository', { path: '/:id/' },　function() {
      this.route('edit');
    };
  });
});
```

---

### Rails's CoC

| path | controller | view |
| --- | --- | --- |
| /repositories | repositories#index | repositories/index.html.erb |
| /repositories/new | repositories#new | repositories/new.html.erb |
| /repositories/1 | repositories#show | repositories/edit.html.erb / repositories/repository/index.hbs  |
| /repositories/1/edit | repositories#edit | repositories/repository/edit.hbs |

* Railsは `app/views/layouts/application.html.erb` の中にデフォルトで各テンプレーを描画する


---

### Ember's CoC

| path | route | controller | template |
| --- | --- | --- | --- |
| /repositories | RepositoriesRoute | RepositoriesController |  repositories.hbs |
| /repositories | RepositoriesIndexRoute | RepositoriesIndexController | repositories/index.hbs |
| /repositories/new | RepositoriesNewRoute | RepositoriesNewController | repositories/new.hbs |
| /repositories/1 | RepositoriesRepositoryRoute | RepositoriesRepositoryController | repositories/repository.hbs  |
| /repositories/1 | RepositoriesRepositoryIndexRoute | RepositoriesRepositoryIndexController |  repositories/repository/index.hbs  |
| /repositories/1/edit | RepositoriesRepositoryEditRoute | RepositoriesRepositoryEditController | repositories/repository/edit.hbs |

* Emberは、親Routeのテンプレート内の `{{outlet}}` の中にテンプレートを描画する(入れ子)
* 親Routeに `{{outlet}}` がないと何も表示されない
* IndexRouteはRailsでいう `show` にあたる

---

### Route Family

| path | route | parent |
| --- | --- | --- |
| /repositories | RepositoriesRoute | ApplicationRoute |
| /repositories/new | RepositoriesNewRoute | RepositoriesRoute  |
| /repositories/1 | RepositoriesRepositoryRoute | RepositoriesRoute |
| /repositories/1 | RepositoriesRepositoryIndexRoute | RepositoriesRepositoryRoute |
| /repositories/1/edit | RepositoriesRepositoryEditRoute | RepositoriesRepositoryRoute |

---

### Tree


![inline](./graphs/route-family-tree.mmd.png)


---

### Path To RepositoriesRepositoryEditRoute

* `/repositories/1/edit`
* ブラウザのリフレッシュか直接URLを叩いた場合、ApplicationRouteからスタートする


![inline](./graphs/route-family-tree-path-to-edit.mmd.png)

---

### Path To RepositoriesRepositoryEditRoute


![inline](./graphs/route-family-tree-path-to-edit-simple.mmd.png)


---

### From RepositoriesIndexRoute

```hbs
{{!-- app/templates/repositories/index.hbs --}}
{{link-to '変更' 'reposotories.repository.edit'}}
```

* /repositories => /repositories/:id/edit

---

### From RepositoriesIndexRoute

![inline](./graphs/route-family-tree-path-to-edit-from-repositories-index.mmd.png)


1. `RepositoriesRepositoryRoute`
2. `RepositoriesRepositoryEditRoute`

- modelフックには落とし穴があるので後ほど詳しく説明します

---

### GitHub Viewerを実装してみよう

TODO: ここから一覧の表示と編集画面までざっと説明していく

主な説明ポイントは、Emberでは各Routeでモデルを取得すること、子Routeはそれを利用する方が効率が良いこと


---

## Task

* GitHub APIから以下の情報を取得し画面に表示する
* emberjs orgのリポジトリ
* リポジトリの詳細情報ページ
* 最近のコミットを5件詳細ページに表示
* contributorsを別ページに表示

---

## URLs

| Path | Description |
| --- | ---- |
| /repositories | emberjs org repository list |
| /repositories/:name | repository detail |
| /repositories/:name/contributors | repository collaborator list |

---

### Screen

---

### Rails

- Railsでturoblinksやajaxを使わない場合
- 各URL毎にHTMLを全部取得する

---

### Rails

```ruby
resources :repository, only: [:index, :show] do
  get 'contributors', on: :member
end

class RepositoriesController < ApplicationController
  before_action :set_repository, only: [:show, :contributors]
  def index
    @repositories = Repository.where(org: 'emberjs').all
  end

  private

  def set_repository
    @repository = Repository.find_by(name: params[:name])
  end
end

class Repository < ApplicationRecord
  has_many :commits
  has_many :contributors, class_name: User
end
```

---

### Rails

`repositories/show.html.erb`

```erb
<%= render 'header' %>
<h2>Recent Commits</h2>
<table>
  <thead>
    <tr>
      <th>Author</th>
      <th>Message</th>
```

`repositories/contributors.html.erb`

```erb
<%= render 'header' %>
<ul>
  <% @repository.contributors.each do |user| %>
```

---

### Emberではどうする？

- SPA
- 提供されているAPIからデータを取得する必要がある
- ページごとに必要なデータを毎回全部取得してHTMLを全置き換え？ :no_good:
- 画面に必要なデータだけ取得して、必要な部分だけ置き換える :ok_woman:

---

### Endpoints

| Path | Description |
| --- | --- |
| /orgs/:owner/repos | an org's repositories |
| /repos/:owner/:repo | a repository detail |
| /repos/:owner/:repo/commits | a repository's recent commits |
| /repos/:owner/:repo/commits/:sha | a repository's commit detail |



---

---

### Convention of model hook

model hook will not be executed every time.
モデルフックは毎回実行されるわけではありません。

# :scream:

 In some cases, your overriding code will be ignored.
 上書きしたコードが無視されることがあります。

---

### Convention of model hook

```js
// app/routes/repositories.js
Ember.Route.extend({
  model() { [{name: 'a'}, {name: 'b'}] }
});

// app/routes/repositories/repository.js
Ember.Route.extend({
  model(params) {
    let repo = this.modelFor('repositories').findBy('name', params.name);
    // here's the important part; ここ重要！
    return this.ajax.request(`${api}/repos/${repo.name}/`);
  }
});

// app/routes/repositories/edit.js
Ember.Route.extend({
  model() {
   return this.modelFor('repository');
  }
});
```

---

### Convention of model hook

Passing non-integer nor non-string

```js
this.transitionTo('repositories.repository', repo);
                                             ^^^^
```

```hbs
{{link-to 'Show' 'repositories.repository' repo}}
                                           ^^^^
```

```js
// The executed model hook will be like this.
// The ajax request will not be executed.
// app/routes/repositories/repository.js
Ember.Route.extend({
  model(params) {
    return this.modelFor('repositories').findBy('name', params.name);
  }
});
```

---

### Convention of model hook

Passing integer or string...

```js
this.transitionTo('repositories.repository', repo.name);
                                             ^^^^^^^^^
```

```hbs
{{link-to 'Show' 'repositories.repository' repo.name}}
                                           ^^^^^^^^^
```

```js
// The executed model hook will be as-is.
// app/routes/repositories/repository.js
Ember.Route.extend({
  model(params) {
    let repo = this.modelFor('repositories').findBy('name', params.name);
    return this.ajax.request(`${api}/repos/${repo.name}/`);
  }
});
```

---

### Convention of model hook

- link-to transitionToのパラメータがintかstringを渡すとmodelフックは書いたコードの通り実行される
- それ以外の時はEmberのconventionによって解決される
- 単純にoverrideしたつもりでも、挙動が呼び出し方で変わるので注意が必要 :bomb: :bomb: :bomb:
- http://emberjs.com/api/classes/Ember.Route.html#method_model

:sweat_smile:

---

^
RepositoryIndexRouteを省略するとRepositoryRouteのmodelが使われる、ように見えます。
が、ブラウザのリフレッシュの時はそのように見えて、別のRouteからの遷移の時はmodelは親Routeから引き継がれません。
liveReloadを使っていて開発していると、その画面を開発している時は気がつきにくいので、覚えておいた方が良いですね。
親Routeのmodelに依存するときは、RouteのmodelでmodelForで明示的に呼び出します。

---

<!-- エラーの時は流れが違うのでどこかで軽く触れておく -->

## 例3 ApplicationError

* `beforeModel`、 `model`、`afterModel` で返した`Promise` が `reject` されると、`error`アクションが呼ばれ、テンプレートが存在すれば描画する

---

* /hello-world にアクセスした時に
* ApplicationRouteでエラーが起きた場合

---

## 例4 HelloWorldError

* /hello-world にアクセスした時に
* HelloWorldRouteでエラーが起きた場合

---

## その他

複数のリソースを取得する例

### afterModel

メインのモデルに紐づくデータを取得するケース

### RSVP.hash

ダッシュボードのような、複数のモデルを画面に表示するケース
