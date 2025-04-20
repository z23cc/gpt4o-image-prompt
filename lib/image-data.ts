import { ImageWithPrompt } from "@/types/types"

// 所有案例的图片和提示词数据
export const imageData: ImageWithPrompt[] = [
  {
    id: "1",
    src: "/example_proposal_scene_q_realistic.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，场景换成求婚，背景换成淡雅五彩花瓣做的拱门，背景换成浪漫颜色，地上散落着玫瑰花瓣。除了人物采用Q版 3D人物风格，其他环境采用真实写实风格。"
  },
  {
    id: "2",
    src: "/example_polaroid_breakout.png",
    prompt: "将场景中的角色转化为3D Q版风格，放在一张拍立得照片上，相纸被一只手拿着，照片中的角色正从拍立得照片中走出，呈现出突破二维相片边框、进入二维现实空间的视觉效果。"
  },
  {
    id: "3",
    src: "/example_vintage_poster.jpeg",
    prompt: "复古宣传海报风格，突出中文文字，背景为红黄放射状图案。画面中心位置有一位美丽的年轻女性，以精致复古风格绘制，面带微笑，气质优雅，具有亲和力。主题是GPT最新AI绘画服务的广告促销，强调'惊爆价9.9/张'、'适用各种场景、图像融合、局部重绘'、'每张提交3次修改'、'AI直出效果，无需修改'，底部醒目标注'有意向点右下我想要'，右下角绘制一个手指点击按钮动作，左下角展示OpenAI标志。"
  },
  {
    id: "4",
    src: "/example_q_chinese_wedding.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景囍字剪纸风格图案。服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。头饰要求：男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。"
  },
  {
    id: "5",
    src: "/example_portal_crossing_handhold.jpeg",
    prompt: "照片中的角色的 3D Q 版形象穿过传送门，牵着观众的手，在将观众拉向前时动态地回头一看。传送门外的背景是观众的现实世界，一个典型的程序员的书房，有书桌，显示器和笔记本电脑，传送门内是角色所处的3D Q 版世界，细节可以参考照片，整体呈蓝色调，和现实世界形成鲜明对比。传送门散发着神秘的蓝色和紫色色调，是两个世界之间的完美椭圆形框架处在画面中间。从第三人称视角拍摄的摄像机角度，显示观看者的手被拉入角色世界。3：2 的宽高比。"
  },
  {
    id: "6",
    src: "/example_ps2_gta_shrek.jpeg",
    prompt: "Can you create a PS2 video game case of \"Grand Theft Auto: Far Far Away\" a GTA based in the Shrek Universe."
  },
  {
    id: "7",
    src: "/example_personalized_room.png",
    prompt: "为我生成我的房间设计（床、书架、沙发、电脑桌和电脑、墙上挂着绘画、绿植，窗外是城市夜景。可爱 3d 风格，c4d 渲染，轴测图。"
  },
  {
    id: "8",
    src: "/example_lego_collectible.jpeg",
    prompt: "根据我上传的照片，生成一张纵向比例的照片，使用以下提示词：\n\n经典乐高人偶风格，一个微缩场景 —— 一只动物站在我身旁。这只动物的配色与我相匹配。\n\n请根据你对我的理解来创造这只动物（你可以选择任何你认为适合我的动物，不论是真实存在的，还是超现实的、幻想的，只要你觉得符合我的气质即可）。\n\n整个场景设定在一个透明玻璃立方体内，布景极简。\n\n微缩场景的底座是哑光黑色，配以银色装饰，风格简约且时尚。\n\n底座上有一块优雅雕刻的标签牌，字体为精致的衬线体，上面写着该动物的名称。\n\n底部设计中还巧妙融入了类似自然历史博物馆展示的生物学分类信息，以精细蚀刻的方式呈现。\n\n整体构图像是一件高端收藏艺术品：精心打造、策展般呈现、灯光细致。\n\n构图重在平衡。背景为渐变色，从深色到浅色过渡（颜色基于主色调进行选择）。"
  },
  {
    id: "9",
    src: "/example_pearl_earring_balloon.jpeg",
    prompt: "将图片中的人物变成玩偶形状的氦气球"
  },
  {
    id: "10",
    src: "/example_maga_hat_cartoon.jpeg",
    prompt: "一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语\"MAKE AMERICA GREAT AGAIN\"，帽侧贴着白色标签写着\"MADE IN CHINA\"，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价\"$50.00\"被粗黑线X划掉，改为\"$77.00\"，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。"
  },
  {
    id: "11",
    src: "/example_3d_collectible_couple_box.jpeg",
    prompt: "根据照片上的内容打造一款细致精美、萌趣可爱的3D渲染收藏摆件，装置在柔和粉彩色调、温馨浪漫的展示盒中。展示盒为浅奶油色搭配柔和的金色装饰，形似精致的便携珠宝盒。打开盒盖，呈现出一幕温暖浪漫的场景：两位Q版角色正甜蜜相望。盒顶雕刻着'FOREVER TOGETHER'（永远在一起）的字样，周围点缀着小巧精致的星星与爱心图案。\n盒内站着照片上的女性，手中捧着一束小巧的白色花束。她的身旁是她的伴侣，照片上的男性。两人都拥有大而闪亮、充满表现力的眼睛，以及柔和、温暖的微笑，传递出浓浓的爱意和迷人的气质。\n他们身后有一扇圆形窗户，透过窗户能看到阳光明媚的中国古典小镇天际线和轻柔飘浮的云朵。盒内以温暖的柔和光线进行照明，背景中漂浮着花瓣点缀气氛。整个展示盒和角色的色调优雅和谐，营造出一个奢华而梦幻的迷你纪念品场景。\n尺寸：9:16"
  },
  {
    id: "12",
    src: "/example_photo_to_3d_q.png",
    prompt: "将场景中的角色转化为3D Q版风格，同时保持原本的场景布置和服装造型不变。"
  },
  {
    id: "13",
    src: "/example_one_piece_figure_creation.png",
    prompt: "把照片中的人物变成《海贼王》（One Piece）动漫主题手办包装盒的风格，以等距视角（isometric）呈现。包装盒内展示的是基于照片人物的《海贼王》动漫画风设计的形象，旁边搭配有日常必备物品（手枪、手表、西装和皮鞋）同时，在包装盒旁边还应呈现该手办本体的实物效果，采用逼真的、具有真实感的渲染风格。"
  },
  {
    id: "14",
    src: "/example_gpt_involution_poster.png",
    prompt: "为我生成讽刺海报：GPT 4o 狂卷，都别干图像AI了 还是送外卖吧"
  },
  {
    id: "15",
    src: "/example_pudding_slot.jpeg",
    prompt: "将图标[🎰]变成美味可口布丁造型，Q弹质感，背景粉白渐变，整体甜美、轻盈、可爱"
  },
  {
    id: "16",
    src: "/example_digimon_style.jpeg",
    prompt: "为我生成一张数码宝贝风格的图片，并为我匹配一只数码宝贝"
  },
  {
    id: "17",
    src: "/example_35mm_moscow_flying_island.jpeg",
    prompt: "35 mm photo of Moscow floating in the sky on a flying islands"
  },
  {
    id: "18",
    src: "/example_naruto_stickers.jpeg",
    prompt: "Naruto stickers"
  },
  {
    id: "19",
    src: "/example_paper_cutout_job_ad.jpeg",
    prompt: "The image shows professional drivers of cars and trucks at work, impressive urban and rural speeds, a positive team environment and modern visuals of the fleet - all this advertises a vacancy for drivers with competitive pay, flexible working hours and a clear call to institutions: \"Apply today - we will start tomorrow!\""
  },
  {
    id: "20",
    src: "/example_textbook_redraw.jpeg",
    prompt: "重绘语文课本插画"
  },
  {
    id: "21",
    src: "/example_relativity_manga.jpeg",
    prompt: "make a colorful page of manga describing the theory of relativity. add some humor"
  },
  {
    id: "22",
    src: "/example_einstein_stickfigure_emoji.jpeg",
    prompt: "(分为两步)\n先把图片人物变成手绘简笔画风格\n然后把简笔画按照吐舌头、微笑、皱眉、惊讶、思考、眨眼生成一系列表情包"
  },
  {
    id: "23",
    src: "/example_notebook_promo.png",
    prompt: "画图：画一个小红书封面。\n要求：\n有足够的吸引力吸引用户点击；\n字体醒目，选择有个性的字体；\n文字大小按重要度分级，体现文案的逻辑结构；\n标题是普通文字的至少2倍；\n文字段落之间留白。\n只对要强调的文字用醒目色吸引用户注意；\n背景使用吸引眼球的图案（包括不限于纸张，记事本，微信聊天窗口，选择一种）\n使用合适的图标或图片增加视觉层次，但要减少干扰。\n\n文案：重磅！ChatGPT又变强了！\n多任务处理更牛✨\n编程能力更强💪\n创造力爆表🎨\n快来试试！\n\n图像9:16比例"
  },
  {
    id: "24",
    src: "/example_titanic_q_realistic.jpeg",
    prompt: "将附图中的人物转换成可爱Q版3D造型\n场景：在豪华游轮最顶尖的船头，船头是尖的。\n男士带着女士站在泰坦尼克号船头，男士双手搂着女士的腰，女士双臂伸展穿着连衣裙，迎着风，脸上洋溢着自由与畅快。\n此时天色呈现出黄昏的暖色调，大海在船下延展 。\n除了人物用Q版3D造型以外，其他环境都是实物。"
  },
  {
    id: "25",
    src: "/funko-pop-james-bond-figure-and-box.png",
    prompt: "把照片中的人物变成 Funko Pop 公仔包装盒的风格，以等距视角（isometric）呈现，并在包装盒上标注标题为'JAMES BOND'。包装盒内展示的是照片中人物形象，旁边搭配有人物的必备物品（手枪、手表、西装、其他）同时，在包装盒旁边还应呈现该公仔本体的实物效果，采用逼真的、具有真实感的渲染风格。"
  },
  {
    id: "26",
    src: "/example_minimalist_3d_toilet.png",
    prompt: "Generate a toilet with the following JSON profile:\n{\n  \"art_style_profile\": {\n    \"style_name\": \"Minimalist 3D Illustration\",\n    \"visual_elements\": {\n      \"shape_language\": \"Rounded edges, smooth and soft forms with simplified geometry\",\n      \"colors\": {\n        \"primary_palette\": [\"Soft beige, light gray, warm orange\"],\n        \"accent_colors\": [\"Warm orange for focal elements\"],\n        \"shading\": \"Soft gradients with smooth transitions, avoiding harsh shadows or highlights\"\n      },\n      \"lighting\": {\n        \"type\": \"Soft, diffused lighting\",\n        \"source_direction\": \"Above and slightly to the right\",\n        \"shadow_style\": \"Subtle and diffused, no sharp or high-contrast shadows\"\n      },\n      \"materials\": {\n        \"surface_texture\": \"Matte, smooth surfaces with subtle shading\",\n        \"reflectivity\": \"Low to none, avoiding glossiness\"\n      },\n      \"composition\": {\n        \"object_presentation\": \"Single, central object displayed in isolation with ample negative space\",\n        \"perspective\": \"Slightly angled, giving a three-dimensional feel without extreme depth\",\n        \"background\": \"Solid, muted color that complements the object without distraction\"\n      },\n      \"typography\": {\n        \"font_style\": \"Minimalistic, sans-serif\",\n        \"text_placement\": \"Bottom-left corner with small, subtle text\",\n        \"color\": \"Gray, low-contrast against the background\"\n      },\n      \"rendering_style\": {\n        \"technique\": \"3D render with simplified, low-poly aesthetics\",\n        \"detail_level\": \"Medium detail, focusing on form and color over texture or intricacy\"\n      }\n    },\n    \"purpose\": \"To create clean, aesthetically pleasing visuals that emphasize simplicity, approachability, and modernity.\"\n  }\n}"
  },
  {
    id: "27",
    src: "/example_chibi_emoji_pack.png",
    prompt: "创作一套全新的 chibi sticker，共六个独特姿势，以用户形象为主角：\n1. 双手比出剪刀手，俏皮地眨眼；\n2. 泪眼汪汪、嘴唇微微颤动，呈现可爱哭泣的表情；\n3. 张开双臂，做出热情的大大拥抱姿势；\n4. 侧卧入睡，靠着迷你枕头，带着甜甜的微笑；\n5. 自信满满地向前方伸手指，周围点缀闪亮特效；\n6. 手势飞吻，周围飘散出爱心表情。\n保留 chibi 美学风格：夸张有神的大眼睛、柔和的面部线条、活泼俏皮的短款黑色发型、配以大胆领口设计的白色服饰，背景使用充满活力的红色，并搭配星星或彩色纸屑元素进行装饰。周边适当留白。\nAspect ratio: 9:16"
  },
  {
    id: "28",
    src: "/example_flat_sticker_pearl_earring.jpeg",
    prompt: "把这张照片设计成一个极简扁平插画风格的Q版贴纸，厚白边，保留人物特征，风格要可爱一些，人物要超出圆形区域边框，圆形区域要为纯色不要3d感，透明背景"
  },
  {
    id: "29",
    src: "/example_pearl_earring_ootd.png",
    prompt: "为图片人物生成不同职业风的OOTD，时尚穿搭和配饰，和人物色系一致的纯色背景，Q版 3d，c4d渲染，保持人脸特征，姿势都要保持一致，人物的比例腿很修长\n\n构图：9:16\n顶部文字：OOTD，左侧为人物ootd q版形象，右侧为穿搭的单件展示\n\n先来第一个职业：时尚设计师"
  },
  {
    id: "30",
    src: "/example_master_oats_ad.png",
    prompt: "《大师麦片》：根据我上传的照片的人物特征判断，为他生成一个符合他特质的燕麦片搭配（比如蔬菜、水果、酸奶、粗粮等等）和包装设计，然后生成他作为麦片包装盒封面人物 加 相应麦片搭配的广告封面，人物要保持特征、可爱Q版3d、c4d渲染风格，麦片所放置的地方的风格也要符合设定，比如放在厨房、超市 极简主义的设计台上等等，先做好设定，再生成图像"
  },
  {
    id: "31",
    src: "/example_minimalist_3d_toilet_txt.jpeg",
    prompt: "画一个马桶：\n\n## 艺术风格简介：极简主义3D插画（Minimalist 3D Illustration）\n\n### 🎨 视觉元素（Visual Elements）\n\n#### 🟢 造型语言（Shape Language）\n- 圆润的边缘、平滑柔和的外形，采用简化几何造型。\n\n#### 🎨 色彩（Colors）\n- **主色调：** 柔和米色、浅灰色、暖橙色。\n- **强调色：** 暖橙色用于焦点元素。\n- **明暗处理：** 柔和渐变，平滑过渡，避免强烈的阴影和高光。\n\n#### 💡 光照（Lighting）\n- **类型：** 柔和、漫反射光照。\n- **光源方向：** 上方稍偏右。\n- **阴影风格：** 微妙且漫射，无锐利或高对比度的阴影。\n\n#### 🧱 材质（Materials）\n- **表面纹理：** 哑光、平滑的表面，带有微妙的明暗变化。\n- **反射性：** 低或无，避免明显的光泽。\n\n#### 🖼️ 构图（Composition）\n- **对象呈现：** 单一、居中的物体，周围留出大量负空间。\n- **视角：** 轻微倾斜视角，呈现适度的三维感，但无明显的景深效果。\n- **背景：** 纯色、低饱和度，与主体协调且不干扰视线。\n\n#### ✒️ 字体排版（Typography）\n- **字体风格：** 极简、无衬线字体。\n- **文字位置：** 左下角，尺寸小巧且不突出。\n- **字体颜色：** 灰色，与背景形成低对比度。\n\n#### 🖥️ 渲染风格（Rendering Style）\n- **技术手法：** 3D渲染，采用简化的低多边形风格。\n- **细节程度：** 中等细节，以形状和色彩为主，避免复杂纹理和细节。\n\n### 🎯 风格目标（Purpose）\n> 创建干净、美观的视觉效果，强调简洁、亲和和现代感。"
  },
  {
    id: "32",
    src: "/example_hand_drawn_infographic.jpeg",
    prompt: "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n'做 IP 是长期复利\n坚持每日更新，肯定会有结果，因为 99% 都坚持不了的！'"
  },
  {
    id: "33",
    src: "/example_social_media_doodle.jpeg",
    prompt: "生成图片，把它打印出来，然后用红墨水疯狂地加上手写中文批注、涂鸦、乱画，如果你想的话，还可以加点小剪贴画"
  },
  {
    id: "34",
    src: "/example_fantasy_computer_head_portal.jpeg",
    prompt: "A cartoon-style character with a smiling computer monitor as its head, wearing gloves and boots, happily jumping through a glowing, blue, circular portal in a lush, fantasy forest landscape. The forest is detailed with large trees, mushrooms, flowers, a serene river, floating islands, and an atmospheric starry night sky with multiple moons. Bright, vibrant colors with soft lighting, fantasy illustration style."
  },
  {
    id: "35",
    src: "/example_two_panel_manga_president.jpeg",
    prompt: "创建一张日系萌系双格漫画，上下排列，主题：少女总统的工作日常。\n\n角色形象: 将上传的附件转换为日系萌系卡通女生形象的风格，保留原图所有细节，如服饰（西装）、发型（明亮的金黄色）、五官等。 \n\n第一格: \n- 表情: 委屈巴巴，沮丧的表情，单手托腮 \n- 文字框: \"肿么办嘛！他不跟我通话！(；´д｀)\" \n- 场景: 暖色调办公室，背后美国国旗，桌上放着一堆汉堡，一个复古红色转盘电话，人物在画面左边，电话在右边。  \n\n第二格:  \n- 表情: 咬牙切齿，暴怒，脸涨红 \n- 动作: 猛拍桌子，汉堡震得跳起来 \n- 文字泡: \"哼！关税加倍！不理我是他们的损失！( `д´ )\" - 场景: 和第一格相同，但一片狼藉。 \n\n其他说明:  \n- 文字采用简洁可爱的手写体，整体风格可爱而有趣。 \n- 构图饱满生动，请保留足够空间用于文字显示，适当留白。 \n- 图片比例 2:3。 \n- 画面整体色彩鲜艳，突出卡通风格。"
  },
  {
    id: "36",
    src: "/example_miniature_journey_west.jpeg",
    prompt: "微型立体场景呈现，运用移轴摄影的技法，呈现出Q版【孙悟空三打白骨精】场景"
  },
  {
    id: "37",
    src: "/example_3d_q_snowglobe_couple.jpeg",
    prompt: "将附图中的人物转换成水晶球场景。 整体环境：水晶球放在窗户旁桌面上，背景模糊，暖色调。阳光透过球体，洒下点点金光，照亮了周围的黑暗。 水晶球内部：人物是可爱Q版3D造型，相互之间满眼的爱意。"
  },
  {
    id: "38",
    src: "/example_matryoshka_pearl_earring.png",
    prompt: "把图片人物生成变成 Q 版可爱俄罗斯套娃🪆，大到小一共五个，放在精致的木桌上，横幅4:3比例"
  },
  {
    id: "39",
    src: "/example_rpg_card_designer.png",
    prompt: "Create a digital character card in RPG collectible style.\nThe subject is a 【Programmer】, standing confidently with tools or symbols relevant to their job.\nRender it in 3D cartoon style, soft lighting, vivid personality.\nInclude skill bars or stats like [Skill1 +x], [Skill2 +x, e.g., Creativity +10, UI/UX +8].\nAdd a title banner on top and a nameplate on the bottom.\nFrame the card with clean edges like a real figure box.\nMake the background fit the profession's theme.\nColors: warm highlights, profession-matching hues."
  },
  {
    id: "40",
    src: "/example_university_mascot_npu.jpeg",
    prompt: "給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色"
  },
  {
    id: "41",
    src: "/example_happy_capsule.png",
    prompt: "标题（大字）：速效快乐胶囊\n\n一颗上为星巴克绿下为透明的小药丸，上面印有星巴克logo，里面有很多咖啡豆\n\n说明（小字）：请在悲伤难过时服用，一日三次，一次两粒\n\n购买按钮 和 药丸颜色一致，下面价格：$9，请遵循医嘱酌情购买"
  },
  {
    id: "42",
    src: "/example_low_poly_lizard.jpeg",
    prompt: "一个 [subject] 的低多边形 3D 渲染图，由干净的三角形面构成，具有平坦的 [color1] 和 [color2] 表面。环境是一个风格化的数字沙漠，具有极简的几何形状和环境光遮蔽效果。"
  },
  {
    id: "43",
    src: "/example_ordinary_selfie_eason_nicholas.jpeg",
    prompt: "请画一张极其平凡无奇的iPhone 自拍照，没有明确的主体或构图感，就像是随手一拍的快照。照片略带运动模糊，阳光或店内灯光不均导致轻微曝光过度。角度尴尬、构图混乱，整体呈现出一种刻意的平庸感-就像是从口袋里拿手机时不小心拍到的一张自拍。主角是陈奕迅和谢霆锋，晚上，旁边是香港会展中心，在香港维多利亚港旁边。"
  },
  {
    id: "44",
    src: "/example_emoji_cushion_pleading.jpeg",
    prompt: "Create a high-resolution 3D render of [🥹] designed as an inflatable, puffy object. The shape should appear soft, rounded, and air-filled — like a plush balloon or blow-up toy. Use a smooth, matte texture with subtle fabric creases and stitching to emphasize the inflatable look. The form should be slightly irregular and squishy, with gentle shadows and soft lighting that highlight volume and realism. Place it on a clean, minimal background (light gray or pale blue), and maintain a playful, sculptural aesthetic."
  },
  {
    id: "45",
    src: "/example_paper_craft_emoji_fire.jpeg",
    prompt: "A paper craft-style \"🔥\" floating on a pure white background. The emoji is handcrafted from colorful cut paper with visible textures, creases, and layered shapes. It casts a soft drop shadow beneath, giving a sense of lightness and depth. The design is minimal, playful, and clean — centered in the frame with lots of negative space. Use soft studio lighting to highlight the paper texture and edges."
  },
  {
    id: "46",
    src: "/example_passport_stamp_beijing.jpeg",
    prompt: "创建一个逼真的护照页，并盖上[北京, 中国]的入境章。章面应以粗体英文写明'欢迎来到北京'，并设计成圆形或椭圆形，并带有装饰性边框。章面应包含'ARRIVAL'字样和一个虚构的日期，例如'2025年4月16日'。在章面中加入{故宫}的微妙轮廓作为背景细节。使用深蓝色或红色墨水并略加晕染，以增强真实感。章面应略微倾斜，如同手工压印。护照页应清晰可见纸张纹理和安全图案"
  },
  {
    id: "47",
    src: "/example_lara_croft_card_break.jpeg",
    prompt: "一幅超写实、电影感的插画，描绘了劳拉·克劳馥动态地撞穿一张'考古探险'集换卡牌的边框。她正处于跳跃中或用绳索摆荡，穿着标志性的冒险装备，可能正在使用双枪射击，枪口的火焰帮助将卡牌古老的石雕边框震碎，在破口周围制造出可见的维度破裂效果，如能量裂纹和空间扭曲，使灰尘和碎片四散飞溅。她的身体充满活力地向前冲出，带有明显的运动深度，突破了卡牌的平面，卡牌内部（背景）描绘着茂密的丛林遗迹或布满陷阱的古墓内部。卡牌的碎屑与 crumbling 的石头、飞舞的藤蔓、古钱币碎片和用过的弹壳混合在一起。'考古探险'的标题和'劳拉·克劳馥'的名字（带有一个风格化的文物图标）在卡牌剩余的、布满裂纹和风化痕迹的部分上可见。充满冒险感的、动态的灯光突出了她的运动能力和危险的环境。"
  },
  {
    id: "48",
    src: "/example_fashion_design_cover.jpeg",
    prompt: "一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字'FASHION DESIGN'。画面背景采用简约的纯浅灰色，以突出人物主体。"
  },
  {
    id: "49",
    src: "/example_voxel_icons.jpeg",
    prompt: "三个步骤\n1. 上传参考图\n2. 上传要转换的照片\n3. 提示词：将图片/描述/emoji转换为参考图一样的体素 3D 图标，Octane 渲染，8k"
  },
  {
    id: "50",
    src: "/example_esc_keycap_diorama.jpeg",
    prompt: "一个超写实的等距视角 3D 渲染图，展示了一个微型电脑工作室，它位于一个半透明的机械键盘键帽内，该键帽特别放置在一个真实的哑光表面机械键盘的 'ESC' 键上。键帽内部，一个小人穿着舒适的有纹理连帽衫，坐在现代人体工学椅子上，正在一个发光的超逼真电脑屏幕前工作。环境充满了逼真的微型科技配件：真实材质的台灯、带有反光的显示器、微小的扬声器格栅、缠绕的电线和陶瓷杯子。场景底部由泥土、岩石和苔藓构成，具有照片级的纹理和瑕疵。键帽内部的光线模仿自然的清晨阳光，投下柔和的阴影和温暖的色调，而外部则有来自周围键盘的冷色调环境反射。单词'ESC'以微弱的磨砂玻璃效果巧妙地蚀刻在半透明键帽的顶部——根据角度仅勉强可见。周围的键盘按键如 F1、Q、Shift 和 CTRL 清晰、有纹理，并具有照片级的逼真光照。拍摄效果如同使用高端手机相机，具有浅景深、完美的白平衡和电影般的细节。"
  },
  {
    id: "51",
    src: "/example_family_wedding_photo_q.jpeg",
    prompt: "将照片里的转换成Q版 3D人物，父母婚礼服饰，孩子是美丽的花童。 父母，西式婚礼服饰，父亲礼服，母亲婚纱。孩子手捧鲜花。 背景是五彩鲜花做的拱门。 除了人物是3D Q版，环境其他都是写实。 整体放在一个相框里。"
  },
  {
    id: "52",
    src: "/example_hand_drawn_infographic_cognition.jpeg",
    prompt: "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。\n整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n\n<h1><span style='color:red'>'认知'</span>决定上限\n<span style='color:red'>'圈子'</span>决定机会</h1>\n- 你赚不到'认知'以外的钱，\n- 也遇不到'圈子'以外的机会。"
  },
  {
    id: "53",
    src: "/example_fluffy_pumpkin.jpeg",
    prompt: "将一个简单平面的矢量图标 [🎃] 转化为柔软、立体、毛茸茸的可爱物体。整体造型被浓密的毛发完全覆盖，毛发质感极其真实，带有柔和的阴影。物体居中悬浮于干净的浅灰色背景中，轻盈漂浮。整体风格超现实，富有触感和现代感，带来舒适和俏皮的视觉感受。采用摄影棚级灯光，高分辨率渲染，比例为1:1。"
  },
  {
    id: "54",
    src: "/example_8bit_pixel_burger.jpeg",
    prompt: "创建一个 [🍔] 的极简 8 位像素标志，居中放置在纯白背景上。使用有限的复古调色板，带有像素化细节、锐利边缘和干净的块状形态。该标志应简洁、具有标志性，并能在像素艺术风格中清晰识别——灵感来自经典街机游戏美学。"
  },
  {
    id: "55",
    src: "/example_cloud_art_dragon_great_wall.png",
    prompt: "生成一张照片：捕捉了白天的场景，天空中散落的云彩组成了 [主体/物体] 的形状，位于 [地点] 的上方。"
  }
] 