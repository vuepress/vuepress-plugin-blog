---
date: 2018-04-12 22:00:40
tags: 
  - Git
author: ULIVZ
location: Shanghai
---

# 当你决定去 revert 一个 merge commit 

## 前言

本文将结合一个标准的git工作流，以及具体的例子，来引出何种条件，会触发 git revert 的失败。通过本文，你讲学到：

- 巩固 git 的使用和理解；
- 出现问题能够放心大胆并以正确的姿势来 revert。

## 准备

为了更好地描述本文，我们将从头开始进行一些准备工作。

首先，创建一个repo：

```sh
mkdir git-revert-merge-commit
cd git-revert-merge-commit
git init
```

首先创建两个 commit 来模拟 master 上现有的 commit 记录：

```sh
echo 'file1' > file1 
git add . && git commit -m 'commit 1'
echo 'file2' > file2
git add . && git commit -m 'commit 2'
```

在项目不断的演进过程中，我们会不断地做新功能。假设现在我们要做一个新 feature，为了不 block master 的 CI pipeline，所有的 feature 应该基于新的 branch 来开发。于是，我们创建一个 branch， 并切换到该 branch：

```sh
git branch feature
git checkout feature # 或者使用 git checkout -b feature 一键完成上述两步
```

首先创建两个 commit 来模拟我们完成了这个 feature：

```sh
echo 'file3' > file3
git add . && git commit -m 'feature - commit 1'
echo 'file4' > file4
git add . && git commit -m 'feature - commit 2'
```

在开发 feature 的阶段中，master 上通常会有其他人新进入的 commit，于是我们回到 master，来模拟一下这些 commit:

```sh
git checkout master
echo 'file5' > file5
git add . && git commit -m 'commit 3'
echo 'file6' > file6
git add . && git commit -m 'commit 4' 
```

此时，QA们测完了你的 feature，给了你 thumbup (测试通过) 的 tag，模拟一下这个tag：

```sh
git ck -
git tag thumbup-feature
```

然后，你就可以用这个 tag merge 了：

```sh
git checkout master
git pull origin master # 拉取远程 master 合并到本地 master
git merge thumbup-feature --no-ff # --no-ff 是为了避免 fast-forward
```

![image](https://user-images.githubusercontent.com/23133919/38670017-482ed250-3e7a-11e8-9b03-217a966b4908.png)

在 Webstorm 中查看一下 git log 图：

![image](https://user-images.githubusercontent.com/23133919/38670299-f4b79a48-3e7a-11e8-8d46-28f745856eed.png)

后来，master 上又多了一些 commit：

```sh
echo 'file7' > file7
git add . && git commit -m 'commit 5'
```

好了，到这里，很多开发者觉得自己的事已经做完了，不，此时生产环境的 UT 由于你的 merge 挂了，由于不能 quick fix，也不能 block release，所以只好暂时决定 revert 你的 change，好吧，那就来 revert 吧。

首先，看一下 git log：

![image](https://user-images.githubusercontent.com/23133919/38671905-3ee11ae6-3e7f-11e8-81f2-2d65b9124475.png)

找到 merge 的 commit id, 来 revert 吧：

```sh
git revert cae5381
```

哈哈，问题就来了：

![image](https://user-images.githubusercontent.com/23133919/38672014-914ffaae-3e7f-11e8-8ac8-95e679e9615f.png)


终于出现了该问题，nice。

当然，由于程序员的最强本性是懒，所以我也为想动手的同学准备好了一键运行脚本：

> git init 后 copy 到 iTerm 中运行以下脚本，最后 找到你的 merge commit id 尝试 git revert。

```sh
echo 'file1' > file1; \
git add . && git commit -m 'commit 1'; \
echo 'file2' > file2; \
git add . && git commit -m 'commit 2'; \
git branch feature; \
git checkout feature; \
echo 'file3' > file3; \
git add . && git commit -m 'feature - commit 1'; \
echo 'file4' > file4; \
git add . && git commit -m 'feature - commit 2'; \
git checkout master; \
echo 'file5' > file5; \
git add . && git commit -m 'commit 3'; \
echo 'file6' > file6; \
git add . && git commit -m 'commit 4'; \ 
git ck -; \
git tag thumbup-feature; \
git checkout master; \
git pull origin master; \
git merge thumbup-feature --no-ff; \
echo 'file7' > file7; \
git add . && git commit -m 'commit 5';
```

## 分析

再次给出错误信息：

> error: commit cae5381823aad7c285d017e5cf7e8bc4b7b12240 is a merge but no -m option was given.

我们来看看 -m 到底指的是什么, 援引 [官方文档](https://git-scm.com/docs/git-revert#git-revert--mparent-number), 可以看到：

> Usually you cannot revert a merge because you do not know which side of the merge should be considered the mainline. This option specifies the parent number (starting from 1) of the mainline and allows revert to reverse the change relative to the specified parent.

> Reverting a merge commit declares that you will never want the tree changes brought in by the merge. As a result, later merges will only bring in tree changes introduced by commits that are not ancestors of the previously reverted merge. This may or may not be what you want.

翻译过来就是: 

> 通常情况下，你无法 revert 一个 merge，因为你不知道 merge 的哪一条线应该被视为主线。这个选项（-m）指定了主线的 parent 的代号（从1开始），并允许以相对于指定的 parent 的进行 revert。

> revert 一个 merge commit 意味着你将完全不想要来自 merge commit 带来的 tree change。 因此，之后的 merge 只会引入那些不是之前被 revert 的那个 merge 的祖先引入的 tree change，这可能是也可能不是你想要的。

听起来很绕口，简单解释一下，由于 merge commit 是将两条线合并到一条线上，因此，合并时的那个commit，将具有两个祖先。所以 git 不知道 base 是选择哪个 parent 进行 diff，所以就抱怨了，所以你要用 -m 属性显示地告诉 git 用哪一个 parent。

那么，如何查看当前的commit有几个祖先呢？

1. git show cae5381

```
commit cae5381823aad7c285d017e5cf7e8bc4b7b12240
Merge: edf99ca 125cfdd
Author: ULIVZ <472590061@qq.com>
Date:   Thu Apr 12 18:27:21 2018 +0800

    Merge tag 'thumbup-feature'
```

可以看到，Merge 这个字段便标明了当前的parent，分别是 edf99ca 和 125cfdd

2. Github 上点开这个 commit 也可以看到：

![image](https://user-images.githubusercontent.com/23133919/38673718-b4321c1e-3e84-11e8-8432-ce6816a60a51.png)

接下来，我们用 git log 图来描述一下这两个 parent：

![image](https://user-images.githubusercontent.com/23133919/38674013-992d1242-3e85-11e8-83c0-4cbc0c7d7ac7.png)

是不是很直观？又有人会问了，为什么 master 是 parent1，而 branch 的最后一个 commit 是 parent2。是这样的，当你在 B 分支上把 A merge 到 B 中，那么 B 就是merge commit 的 parent1，而 A 是 parent2。


## 解决

有了上一节的分析，我们可以很直接地给出以下可用的代码：

```sh
git revert cae5381 -m 1
```

输出以下log：

```
Revert "Merge tag 'thumbup-feature'"

This reverts commit cae5381823aad7c285d017e5cf7e8bc4b7b12240, reversing
changes made to edf99ca31755a27b0a43b290263ed810833a95c4.
```

`:wq` 退出看到:

```
[master f0aac26] Revert "Merge tag 'thumbup-feature'"
 2 files changed, 2 deletions(-)
 delete mode 100644 file3
 delete mode 100644 file4
```

file3 和 file4 是 feature branch 上的 commit 引入的文件，被正确地删掉了，cool。

那么 `git revert cae5381 -m 2` 到底会发生什么呢？ 或许你已经有答案，还是来试试看：

首先 reset hard 到 revert 前的最后一个commit，让我们可以再次尝试另一种 revert，这里，你可以用更可爱的 git reflog。

```sh
git reset --hard d208cba 
git revert cae5381 -m 2
```

```
[master 2c5a0ee] Revert "Merge tag 'thumbup-feature'"
 2 files changed, 2 deletions(-)
 delete mode 100644 file5  
 delete mode 100644 file6
 ```

果然，这种 revert 把 master 在 feature branch 期间进行的 commit 都给干掉了。哈哈，很正常，因为此时 diff 是基于 feature branch 的。

说到这里，你是不是豁然开朗了呢？是不是也知道再遇到这种问题，心里有一股底气去revert呢？

### 本文代码均已放到这个仓库上 [git-revert-merge-commit](https://github.com/ulivz/git-revert-merge-commit)

## 结论

 结论如下：

1. 对于单一 parent 的 commit，直接使用 `git revert commit_id`;
2. 对于具有多个 parent 的 commit，需要结合 `-m` 属性：`git revert commit_id -m parent_id`;
3. 对于从 branch 合并到 master 的 merge commit，master 的 parent_id 是1，branch 的 parent_id 是2, 反之亦然;

 最后，附上我自定义的可爱的 git log 的配置(copy到`~/.gitconfig`中的 `[alias]` 下即可)：

 ```sh
lo = log --color --pretty=format:' %C(white bold dim) %C(cyan bold dim)[%h] %Creset %Cgreen%cn %C(white bold dim)| %C(yellow dim)%cr %n%Creset  %C(white dim italic)%s%n%n%Creset'
 ```

话说起来，一年前我有一个如何用 shell 来 enhance git 工作流的库 [git-shell](https://github.com/ulivz/git-shell)，当前，目前没有任何文档，有兴趣的同学可以看一下思路，后面我会写好文档并另开博文。
  
本文就到这里，谢谢阅读。









