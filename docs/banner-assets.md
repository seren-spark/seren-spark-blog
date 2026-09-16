# Breathstone 首页 banner 素材

参考：用户上传的原始截图及 https://motionsites.org/zh/prompts/breathstone 。

使用内置 imagegen 编辑用户截图，保留原图构图，去除原有 UI 与指针。未将目录站点的整页演示录像作为背景。

## 素材

- `public/media/breathstone-stones.webp`：1472 × 1069，去字后的静态封面。
- `public/media/breathstone-stones-loop.mp4`：1472 × 1072，24fps，12 秒，无声 H.264。

视频从去字后的静帧生成，使用周期性 1–1.012 倍缩放形成轻微镜头呼吸。鸟、花草与云并没有独立动画。视频与封面均由本站提供，不依赖远程视频服务。

前景与背景使用同一图像，前景轮廓裁剪后放到标题上方，实现巨石遮挡文字。减少动态效果和节省流量设置下默认不请求视频；播放失败回退到封面。

## 内置图像编辑工具的最终提示词

Edit the user's attached original Breathstone website screenshot into a clean landscape background asset. Preserve the exact original composition, positions, scale, light, pale cream warm sky, distant hazy mountains, central tall slim leaning moss-covered gray rock on the left of the stone group, the wider leaning moss-covered stone on the right, smaller rocks at base, tiny yellow bird perched on right rock, pink and purple flowers, side trees and the foreground path. Remove ALL black MEASURED typography, all top navigation text and rounded pill outlines, the top left black logo, the Reserve Yours button, and the giant black-and-white mouse pointer in the lower center. Inpaint those regions naturally as continuous original sky, stone and foliage. Do not shift the rocks, do not redesign or change the scene. No text, letters, logos, watermarks, UI or pointer. Return the clean scenic background in the same landscape aspect ratio as input.
