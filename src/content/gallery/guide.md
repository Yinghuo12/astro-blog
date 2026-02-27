# 相册使用说明

## 目录结构

```
src/content/gallery/
├── images/              # 所有照片文件放在这里
│   ├── photo1.jpg
│   ├── photo2.png
│   └── travel/
│       └── photo3.jpg
└── photos.md           # 照片信息配置文件（唯一的配置文件）
```

## 如何添加照片

### 1. 上传图片文件

将照片文件放到 `src/content/gallery/images/` 文件夹下。支持子文件夹组织，例如：
- `images/photo1.jpg`
- `images/travel/photo2.jpg`

### 2. 编辑配置文件

打开 `src/content/gallery/photos.md` 文件，在 `photos:` 数组中添加照片信息：

```yaml
---
photos:
  - title: "照片标题"
    description: "照片描述（点击后显示）"
    image: "photo1.jpg"              # 图片文件名，相对于 images 目录
    date: 2024-01-15                # 拍摄日期
    location: "北京·颐和园"          # 拍摄地点
    album: "旅行"                    # 相册分类
    tags: ["风景", "城市"]           # 标签
    draft: false                     # 是否为草稿（true 不显示）
---
```

## 字段说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `title` | 否 | 照片标题 | `"我的旅行照片"` |
| `description` | 否 | 照片描述（点击后显示） | `"这是在公园拍摄的美好瞬间"` |
| `image` | **是** | 图片文件名，相对于 images 目录 | `"photo.jpg"` 或 `"travel/photo.jpg"` |
| `date` | 否 | 拍摄日期 | `2024-01-15` |
| `location` | 否 | 拍摄地点 | `"北京·颐和园"` |
| `album` | 否 | 相册分类（用于分组显示） | `"旅行"` |
| `tags` | 否 | 标签数组 | `["风景", "城市"]` |
| `draft` | 否 | 是否为草稿（true 不显示） | `false` |

## 完整示例

```yaml
---
# 相册配置文件
# 所有照片信息都在这一个文件中配置

photos:
  # 旅行相册
  - title: "美丽的日落"
    description: "在海边拍摄的壮丽日落，金色的阳光洒满海面"
    image: "sunset.jpg"
    date: 2024-01-15
    location: "三亚·亚龙湾"
    album: "旅行"
    tags: ["风景", "海滩", "日落"]

  - title: "城市夜景"
    description: "夜晚的城市灯火辉煌，车水马龙"
    image: "city-night.jpg"
    date: 2024-02-10
    location: "上海·外滩"
    album: "旅行"
    tags: ["城市", "夜景"]

  - title: "山间小屋"
    description: "群山环抱中的温馨小屋"
    image: "travel/mountain-cabin.jpg"
    date: 2024-03-05
    location: "浙江·莫干山"
    album: "旅行"
    tags: ["山景", "建筑"]

  # 美食相册
  - title: "美味佳肴"
    description: "精心制作的美味料理"
    image: "food.jpg"
    date: 2024-01-20
    location: "家里"
    album: "美食"
    tags: ["美食", "烹饪"]

  # 日常相册（不指定 album 会归入"未分类"）
  - title: "可爱猫咪"
    description: "路边遇到的可爱小猫"
    image: "cat.jpg"
    date: 2024-02-15
    location: "小区"
    tags: ["动物", "猫"]
---
```

## 相册分类

相册会按照 `album` 字段自动分组显示。例如：

```yaml
- title: "照片1" album: "旅行"
- title: "照片2" album: "旅行"
- title: "照片3" album: "美食"
```

会在页面上显示为：
- 🖼️ 旅行 (2 张)
- 🖼️ 美食 (1 张)

如果不指定 `album`，照片会显示在"未分类"分组中。

## 注意事项

1. **图片路径**：`image` 字段只填写文件名，相对于 `images/` 目录
2. **子文件夹**：支持在 `images/` 下创建子文件夹，例如 `image: "travel/photo.jpg"`
3. **图片格式**：支持常见的图片格式（jpg、png、webp 等）
4. **图片大小**：建议优化图片大小，避免上传过大的图片文件
5. **唯一配置文件**：所有照片信息都在 `photos.md` 这一个文件中管理

## 访问相册

相册页面地址：`/gallery/`

也可以通过导航栏的 "我的" → "相片" 访问。
