# 本地开发命令

## 启动开发服务器

```bash
cd /Users/yinghuo/Desktop/blog
pnpm run dev
```

或者

```bash
cd /Users/yinghuo/Desktop/blog
pnpm dev
```

启动后访问：http://localhost:4323

## 其他常用命令

```bash
# 构建生产版本
pnpm run build

# 预览生产构建
pnpm run preview

# 格式化代码
pnpm run format

# 代码检查
pnpm run lint
```

## Git 提交到 GitHub

```bash
# 查看当前状态
git status

# 添加所有更改
git add -A

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push
```

### 一键提交命令

```bash
# 添加、提交并推送（一条命令）
git add -A && git commit -m "更新内容" && git push
```