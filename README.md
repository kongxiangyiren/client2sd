# 免费 sd 画图

用于对接土块画图或者koishi的novelai

## 说明

1、这个分支没有鉴图功能,要鉴图功能请切换`main`分支

2、基于`https://huggingface.co/spaces/prodia/fast-stable-diffusion`

3、调用地址：`https://prodia-fast-stable-diffusion.hf.space/`

4、模型修改请修改`.env`

## 1panel 运行

可以按照如图方式运行

如果koishi也是1panel创建的,novelai网址可以填 `http://client2sd:7860`

![alt text](image.png)

## docker 运行 (推荐)

1、编译镜像

```sh
docker build -t client2sd .
```

2、运行容器

```sh
docker run --restart=always -d -p 7860:7860 -v ./.env:/app/.env --name client2sd client2sd
```

## windows 运行

### 安装

```sh
npm i && npm run build
```

### 运行

```
npm run start:prod
```
