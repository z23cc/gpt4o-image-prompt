import { ImageWithPrompt } from "@/types/types"

// 所有案例的图片和提示词数据
export const imageData: ImageWithPrompt[] = [
  {
    id: "1",
    src: "/example_proposal_scene_q_realistic.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，场景换成求婚，背景换成淡雅五彩花瓣做的拱门，背景换成浪漫颜色，地上散落着玫瑰花瓣。除了人物采用Q版 3D人物风格，其他环境采用真实写实风格。",
    category: "3d-render",
    tags: ["Q版", "3D人物", "求婚", "浪漫"]
  },
  {
    id: "2",
    src: "/example_polaroid_breakout.png",
    prompt: "将场景中的角色转化为3D Q版风格，放在一张拍立得照片上，相纸被一只手拿着，照片中的角色正从拍立得照片中走出，呈现出突破二维相片边框、进入二维现实空间的视觉效果。",
    category: "creative",
    tags: ["3D", "Q版", "拍立得", "创意效果"]
  },
  {
    id: "3",
    src: "/example_vintage_poster.jpeg",
    prompt: "复古宣传海报风格，突出中文文字，背景为红黄放射状图案。画面中心位置有一位美丽的年轻女性，以精致复古风格绘制，面带微笑，气质优雅，具有亲和力。主题是GPT最新AI绘画服务的广告促销，强调'惊爆价9.9/张'、'适用各种场景、图像融合、局部重绘'、'每张提交3次修改'、'AI直出效果，无需修改'，底部醒目标注'有意向点右下我想要'，右下角绘制一个手指点击按钮动作，左下角展示OpenAI标志。",
    category: "poster-design",
    tags: ["复古海报", "宣传广告", "中文文字", "商业设计"]
  },
  {
    id: "4",
    src: "/example_q_chinese_wedding.jpeg",
    prompt: "将照片里的两个人转换成Q版 3D人物，中式古装婚礼，大红颜色，背景囍字剪纸风格图案。服饰要求：写实，男士身着长袍马褂，主体为红色，上面以金色绣龙纹图案，彰显尊贵大气，胸前系着大红花，寓意喜庆吉祥。女士所穿是秀禾服，同样以红色为基调，饰有精美的金色花纹与凤凰刺绣，展现出典雅华丽之感，头上搭配花朵发饰，增添柔美温婉气质。二者皆为中式婚礼中经典着装，蕴含着对新人婚姻美满的祝福。头饰要求：男士：中式状元帽，主体红色，饰有金色纹样，帽顶有精致金饰，尽显传统儒雅庄重。女士：凤冠造型，以红色花朵为中心，搭配金色立体装饰与垂坠流苏，华丽富贵，古典韵味十足。",
    category: "3d-render",
    tags: ["Q版", "3D人物", "中式婚礼", "传统服饰"]
  },
  {
    id: "5",
    src: "/example_portal_crossing_handhold.jpeg",
    prompt: "照片中的角色的 3D Q 版形象穿过传送门，牵着观众的手，在将观众拉向前时动态地回头一看。传送门外的背景是观众的现实世界，一个典型的程序员的书房，有书桌，显示器和笔记本电脑，传送门内是角色所处的3D Q 版世界，细节可以参考照片，整体呈蓝色调，和现实世界形成鲜明对比。传送门散发着神秘的蓝色和紫色色调，是两个世界之间的完美椭圆形框架处在画面中间。从第三人称视角拍摄的摄像机角度，显示观看者的手被拉入角色世界。3：2 的宽高比。",
    category: "creative",
    tags: ["3D", "Q版", "传送门", "科幻创意"]
  },
  {
    id: "6",
    src: "/example_ps2_gta_shrek.jpeg",
    prompt: "Can you create a PS2 video game case of \"Grand Theft Auto: Far Far Away\" a GTA based in the Shrek Universe.",
    category: "product-design",
    tags: ["游戏包装", "PS2", "恶搞设计", "产品包装"]
  },
  {
    id: "7",
    src: "/example_personalized_room.png",
    prompt: "为我生成我的房间设计（床、书架、沙发、电脑桌和电脑、墙上挂着绘画、绿植，窗外是城市夜景。可爱 3d 风格，c4d 渲染，轴测图。",
    category: "3d-render",
    tags: ["室内设计", "3D渲染", "C4D", "轴测图"]
  },
  {
    id: "8",
    src: "/example_lego_collectible.jpeg",
    prompt: "根据我上传的照片，生成一张纵向比例的照片，使用以下提示词：\n\n经典乐高人偶风格，一个微缩场景 —— 一只动物站在我身旁。这只动物的配色与我相匹配。\n\n请根据你对我的理解来创造这只动物（你可以选择任何你认为适合我的动物，不论是真实存在的，还是超现实的、幻想的，只要你觉得符合我的气质即可）。\n\n整个场景设定在一个透明玻璃立方体内，布景极简。\n\n微缩场景的底座是哑光黑色，配以银色装饰，风格简约且时尚。\n\n底座上有一块优雅雕刻的标签牌，字体为精致的衬线体，上面写着该动物的名称。\n\n底部设计中还巧妙融入了类似自然历史博物馆展示的生物学分类信息，以精细蚀刻的方式呈现。\n\n整体构图像是一件高端收藏艺术品：精心打造、策展般呈现、灯光细致。\n\n构图重在平衡。背景为渐变色，从深色到浅色过渡（颜色基于主色调进行选择）。",
    category: "product-design",
    tags: ["乐高风格", "收藏品", "微缩场景", "产品设计"]
  },
  {
    id: "9",
    src: "/example_pearl_earring_balloon.jpeg",
    prompt: "将图片中的人物变成玩偶形状的氦气球",
    category: "creative",
    tags: ["创意变形", "气球", "玩偶", "艺术创作"]
  },
  {
    id: "10",
    src: "/example_maga_hat_cartoon.jpeg",
    prompt: "一幅讽刺漫画风格的插画，采用复古美式漫画风格，背景是一个多层货架，货架上都是一样的红色棒球帽，帽子正面印有大字标语\"MAKE AMERICA GREAT AGAIN\"，帽侧贴着白色标签写着\"MADE IN CHINA\"，特写视角聚焦其中一顶红色棒球帽。画面下方有价格牌，原价\"$50.00\"被粗黑线X划掉，改为\"$77.00\"，色调为怀旧的土黄与暗红色调，阴影处理带有90年代复古印刷质感。整体构图风格夸张讽刺，具讽刺政治消费主义的意味。",
    category: "illustration",
    tags: ["讽刺漫画", "复古风格", "政治讽刺", "插画艺术"]
  },
  {
    id: "11",
    src: "/example_3d_collectible_couple_box.jpeg",
    prompt: "根据照片上的内容打造一款细致精美、萌趣可爱的3D渲染收藏摆件，装置在柔和粉彩色调、温馨浪漫的展示盒中。展示盒为浅奶油色搭配柔和的金色装饰，形似精致的便携珠宝盒。打开盒盖，呈现出一幕温暖浪漫的场景：两位Q版角色正甜蜜相望。盒顶雕刻着'FOREVER TOGETHER'（永远在一起）的字样，周围点缀着小巧精致的星星与爱心图案。\n盒内站着照片上的女性，手中捧着一束小巧的白色花束。她的身旁是她的伴侣，照片上的男性。两人都拥有大而闪亮、充满表现力的眼睛，以及柔和、温暖的微笑，传递出浓浓的爱意和迷人的气质。\n他们身后有一扇圆形窗户，透过窗户能看到阳光明媚的中国古典小镇天际线和轻柔飘浮的云朵。盒内以温暖的柔和光线进行照明，背景中漂浮着花瓣点缀气氛。整个展示盒和角色的色调优雅和谐，营造出一个奢华而梦幻的迷你纪念品场景。\n尺寸：9:16",
    category: "product-design",
    tags: ["3D渲染", "收藏品", "情侣纪念", "产品设计"]
  },
  {
    id: "12",
    src: "/example_photo_to_3d_q.png",
    prompt: "将场景中的角色转化为3D Q版风格，同时保持原本的场景布置和服装造型不变。",
    category: "3d-render",
    tags: ["3D", "Q版", "角色转换", "风格转换"]
  },
  {
    id: "13",
    src: "/example_one_piece_figure_creation.png",
    prompt: "把照片中的人物变成《海贼王》（One Piece）动漫主题手办包装盒的风格，以等距视角（isometric）呈现。包装盒内展示的是基于照片人物的《海贼王》动漫画风设计的形象，旁边搭配有日常必备物品（手枪、手表、西装和皮鞋）同时，在包装盒旁边还应呈现该手办本体的实物效果，采用逼真的、具有真实感的渲染风格。",
    category: "product-design",
    tags: ["手办", "动漫风格", "海贼王", "包装设计"]
  },
  {
    id: "14",
    src: "/example_gpt_involution_poster.png",
    prompt: "为我生成讽刺海报：GPT 4o 狂卷，都别干图像AI了 还是送外卖吧",
    category: "poster-design",
    tags: ["讽刺海报", "AI主题", "幽默设计", "社会讽刺"]
  },
  {
    id: "15",
    src: "/example_pudding_slot.jpeg",
    prompt: "将图标[🎰]变成美味可口布丁造型，Q弹质感，背景粉白渐变，整体甜美、轻盈、可爱",
    category: "creative",
    tags: ["图标设计", "食物造型", "可爱风格", "创意变形"]
  },
  {
    id: "16",
    src: "/example_digimon_style.jpeg",
    prompt: "为我生成一张数码宝贝风格的图片，并为我匹配一只数码宝贝",
    category: "illustration",
    tags: ["数码宝贝", "动漫风格", "角色设计", "插画"]
  },
  {
    id: "17",
    src: "/example_35mm_moscow_flying_island.jpeg",
    prompt: "35 mm photo of Moscow floating in the sky on a flying islands",
    category: "photography",
    tags: ["摄影风格", "超现实", "城市景观", "创意摄影"]
  },
  {
    id: "18",
    src: "/example_naruto_stickers.jpeg",
    prompt: "Naruto stickers",
    category: "illustration",
    tags: ["火影忍者", "贴纸设计", "动漫", "角色设计"]
  },
  {
    id: "19",
    src: "/example_paper_cutout_job_ad.jpeg",
    prompt: "The image shows professional drivers of cars and trucks at work, impressive urban and rural speeds, a positive team environment and modern visuals of the fleet - all this advertises a vacancy for drivers with competitive pay, flexible working hours and a clear call to institutions: \"Apply today - we will start tomorrow!\"",
    category: "poster-design",
    tags: ["招聘广告", "职业宣传", "商业设计", "剪纸风格"]
  },
  {
    id: "20",
    src: "/example_textbook_redraw.jpeg",
    prompt: "重绘语文课本插画",
    category: "illustration",
    tags: ["课本插画", "教育设计", "重绘", "传统插画"]
  },
  {
    id: "21",
    src: "/example_relativity_manga.jpeg",
    prompt: "make a colorful page of manga describing the theory of relativity. add some humor",
    category: "illustration",
    tags: ["漫画", "科学", "幽默", "教育"]
  },
  {
    id: "22",
    src: "/example_einstein_stickfigure_emoji.jpeg",
    prompt: "(分为两步)\n先把图片人物变成手绘简笔画风格\n然后把简笔画按照吐舌头、微笑、皱眉、惊讶、思考、眨眼生成一系列表情包",
    category: "illustration",
    tags: ["简笔画", "表情包", "手绘", "角色设计"]
  },
  {
    id: "23",
    src: "/example_notebook_promo.png",
    prompt: "画图：画一个小红书封面。\n要求：\n有足够的吸引力吸引用户点击；\n字体醒目，选择有个性的字体；\n文字大小按重要度分级，体现文案的逻辑结构；\n标题是普通文字的至少2倍；\n文字段落之间留白。\n只对要强调的文字用醒目色吸引用户注意；\n背景使用吸引眼球的图案（包括不限于纸张，记事本，微信聊天窗口，选择一种）\n使用合适的图标或图片增加视觉层次，但要减少干扰。\n\n文案：重磅！ChatGPT又变强了！\n多任务处理更牛✨\n编程能力更强💪\n创造力爆表🎨\n快来试试！\n\n图像9:16比例",
    category: "poster-design",
    tags: ["小红书", "社交媒体", "AI宣传", "封面设计"]
  },
  {
    id: "24",
    src: "/example_titanic_q_realistic.jpeg",
    prompt: "将附图中的人物转换成可爱Q版3D造型\n场景：在豪华游轮最顶尖的船头，船头是尖的。\n男士带着女士站在泰坦尼克号船头，男士双手搂着女士的腰，女士双臂伸展穿着连衣裙，迎着风，脸上洋溢着自由与畅快。\n此时天色呈现出黄昏的暖色调，大海在船下延展 。\n除了人物用Q版3D造型以外，其他环境都是实物。",
    category: "3d-render",
    tags: ["Q版", "3D人物", "泰坦尼克", "浪漫场景"]
  },
  {
    id: "25",
    src: "/funko-pop-james-bond-figure-and-box.png",
    prompt: "把照片中的人物变成 Funko Pop 公仔包装盒的风格，以等距视角（isometric）呈现，并在包装盒上标注标题为'JAMES BOND'。包装盒内展示的是照片中人物形象，旁边搭配有人物的必备物品（手枪、手表、西装、其他）同时，在包装盒旁边还应呈现该公仔本体的实物效果，采用逼真的、具有真实感的渲染风格。",
    category: "product-design",
    tags: ["Funko Pop", "手办", "包装设计", "3D渲染"]
  },
  {
    id: "26",
    src: "/example_minimalist_3d_toilet.png",
    prompt: "Generate a toilet with the following JSON profile:\n{\n  \"art_style_profile\": {\n    \"style_name\": \"Minimalist 3D Illustration\",\n    \"visual_elements\": {\n      \"shape_language\": \"Rounded edges, smooth and soft forms with simplified geometry\",\n      \"colors\": {\n        \"primary_palette\": [\"Soft beige, light gray, warm orange\"],\n        \"accent_colors\": [\"Warm orange for focal elements\"],\n        \"shading\": \"Soft gradients with smooth transitions, avoiding harsh shadows or highlights\"\n      },\n      \"lighting\": {\n        \"type\": \"Soft, diffused lighting\",\n        \"source_direction\": \"Above and slightly to the right\",\n        \"shadow_style\": \"Subtle and diffused, no sharp or high-contrast shadows\"\n      },\n      \"materials\": {\n        \"surface_texture\": \"Matte, smooth surfaces with subtle shading\",\n        \"reflectivity\": \"Low to none, avoiding glossiness\"\n      },\n      \"composition\": {\n        \"object_presentation\": \"Single, central object displayed in isolation with ample negative space\",\n        \"perspective\": \"Slightly angled, giving a three-dimensional feel without extreme depth\",\n        \"background\": \"Solid, muted color that complements the object without distraction\"\n      },\n      \"typography\": {\n        \"font_style\": \"Minimalistic, sans-serif\",\n        \"text_placement\": \"Bottom-left corner with small, subtle text\",\n        \"color\": \"Gray, low-contrast against the background\"\n      },\n      \"rendering_style\": {\n        \"technique\": \"3D render with simplified, low-poly aesthetics\",\n        \"detail_level\": \"Medium detail, focusing on form and color over texture or intricacy\"\n      }\n    },\n    \"purpose\": \"To create clean, aesthetically pleasing visuals that emphasize simplicity, approachability, and modernity.\"\n  }\n}",
    category: "3d-render",
    tags: ["极简主义", "3D插画", "产品设计", "现代风格"]
  },
  {
    id: "27",
    src: "/example_chibi_emoji_pack.png",
    prompt: "创作一套全新的 chibi sticker，共六个独特姿势，以用户形象为主角：\n1. 双手比出剪刀手，俏皮地眨眼；\n2. 泪眼汪汪、嘴唇微微颤动，呈现可爱哭泣的表情；\n3. 张开双臂，做出热情的大大拥抱姿势；\n4. 侧卧入睡，靠着迷你枕头，带着甜甜的微笑；\n5. 自信满满地向前方伸手指，周围点缀闪亮特效；\n6. 手势飞吻，周围飘散出爱心表情。\n保留 chibi 美学风格：夸张有神的大眼睛、柔和的面部线条、活泼俏皮的短款黑色发型、配以大胆领口设计的白色服饰，背景使用充满活力的红色，并搭配星星或彩色纸屑元素进行装饰。周边适当留白。\nAspect ratio: 9:16",
    category: "product-design",
    tags: ["创意","设计"]
  },
  {
    id: "28",
    src: "/example_flat_sticker_pearl_earring.jpeg",
    prompt: "把这张照片设计成一个极简扁平插画风格的Q版贴纸，厚白边，保留人物特征，风格要可爱一些，人物要超出圆形区域边框，圆形区域要为纯色不要3d感，透明背景",
    category: "3d-render",
    tags: ["3D","摄影","插画","设计"]
  },
  {
    id: "29",
    src: "/example_pearl_earring_ootd.png",
    prompt: "为图片人物生成不同职业风的OOTD，时尚穿搭和配饰，和人物色系一致的纯色背景，Q版 3d，c4d渲染，保持人脸特征，姿势都要保持一致，人物的比例腿很修长\n\n构图：9:16\n顶部文字：OOTD，左侧为人物ootd q版形象，右侧为穿搭的单件展示\n\n先来第一个职业：时尚设计师",
    category: "3d-render",
    tags: ["3D","设计"]
  },
  {
    id: "30",
    src: "/example_master_oats_ad.png",
    prompt: "《大师麦片》：根据我上传的照片的人物特征判断，为他生成一个符合他特质的燕麦片搭配（比如蔬菜、水果、酸奶、粗粮等等）和包装设计，然后生成他作为麦片包装盒封面人物 加 相应麦片搭配的广告封面，人物要保持特征、可爱Q版3d、c4d渲染风格，麦片所放置的地方的风格也要符合设定，比如放在厨房、超市 极简主义的设计台上等等，先做好设定，再生成图像",
    category: "3d-render",
    tags: ["3D","摄影","设计"]
  },
  {
    id: "31",
    src: "/example_minimalist_3d_toilet_txt.jpeg",
    prompt: "画一个马桶：\n\n## 艺术风格简介：极简主义3D插画（Minimalist 3D Illustration）\n\n### 🎨 视觉元素（Visual Elements）\n\n#### 🟢 造型语言（Shape Language）\n- 圆润的边缘、平滑柔和的外形，采用简化几何造型。\n\n#### 🎨 色彩（Colors）\n- **主色调：** 柔和米色、浅灰色、暖橙色。\n- **强调色：** 暖橙色用于焦点元素。\n- **明暗处理：** 柔和渐变，平滑过渡，避免强烈的阴影和高光。\n\n#### 💡 光照（Lighting）\n- **类型：** 柔和、漫反射光照。\n- **光源方向：** 上方稍偏右。\n- **阴影风格：** 微妙且漫射，无锐利或高对比度的阴影。\n\n#### 🧱 材质（Materials）\n- **表面纹理：** 哑光、平滑的表面，带有微妙的明暗变化。\n- **反射性：** 低或无，避免明显的光泽。\n\n#### 🖼️ 构图（Composition）\n- **对象呈现：** 单一、居中的物体，周围留出大量负空间。\n- **视角：** 轻微倾斜视角，呈现适度的三维感，但无明显的景深效果。\n- **背景：** 纯色、低饱和度，与主体协调且不干扰视线。\n\n#### ✒️ 字体排版（Typography）\n- **字体风格：** 极简、无衬线字体。\n- **文字位置：** 左下角，尺寸小巧且不突出。\n- **字体颜色：** 灰色，与背景形成低对比度。\n\n#### 🖥️ 渲染风格（Rendering Style）\n- **技术手法：** 3D渲染，采用简化的低多边形风格。\n- **细节程度：** 中等细节，以形状和色彩为主，避免复杂纹理和细节。\n\n### 🎯 风格目标（Purpose）\n> 创建干净、美观的视觉效果，强调简洁、亲和和现代感。",
    category: "3d-render",
    tags: ["3D","插画"]
  },
  {
    id: "32",
    src: "/example_hand_drawn_infographic.jpeg",
    prompt: "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n'做 IP 是长期复利\n坚持每日更新，肯定会有结果，因为 99% 都坚持不了的！'",
    category: "product-design",
    tags: ["插画","设计"]
  },
  {
    id: "33",
    src: "/example_social_media_doodle.jpeg",
    prompt: "生成图片，把它打印出来，然后用红墨水疯狂地加上手写中文批注、涂鸦、乱画，如果你想的话，还可以加点小剪贴画",
    category: "creative",
    tags: ["手绘", "涂鸦", "批注", "创意艺术"]
  },
  {
    id: "34",
    src: "/example_fantasy_computer_head_portal.jpeg",
    prompt: "A cartoon-style character with a smiling computer monitor as its head, wearing gloves and boots, happily jumping through a glowing, blue, circular portal in a lush, fantasy forest landscape. The forest is detailed with large trees, mushrooms, flowers, a serene river, floating islands, and an atmospheric starry night sky with multiple moons. Bright, vibrant colors with soft lighting, fantasy illustration style.",
    category: "illustration",
    tags: ["卡通", "科技", "奇幻", "传送门"]
  },
  {
    id: "35",
    src: "/example_two_panel_manga_president.jpeg",
    prompt: "创建一张日系萌系双格漫画，上下排列，主题：少女总统的工作日常。\n\n角色形象: 将上传的附件转换为日系萌系卡通女生形象的风格，保留原图所有细节，如服饰（西装）、发型（明亮的金黄色）、五官等。 \n\n第一格: \n- 表情: 委屈巴巴，沮丧的表情，单手托腮 \n- 文字框: \"肿么办嘛！他不跟我通话！(；´д｀)\" \n- 场景: 暖色调办公室，背后美国国旗，桌上放着一堆汉堡，一个复古红色转盘电话，人物在画面左边，电话在右边。  \n\n第二格:  \n- 表情: 咬牙切齿，暴怒，脸涨红 \n- 动作: 猛拍桌子，汉堡震得跳起来 \n- 文字泡: \"哼！关税加倍！不理我是他们的损失！( `д´ )\" - 场景: 和第一格相同，但一片狼藉。 \n\n其他说明:  \n- 文字采用简洁可爱的手写体，整体风格可爱而有趣。 \n- 构图饱满生动，请保留足够空间用于文字显示，适当留白。 \n- 图片比例 2:3。 \n- 画面整体色彩鲜艳，突出卡通风格。",
    category: "illustration",
    tags: ["日系漫画", "萌系", "政治讽刺", "双格漫画"]
  },
  {
    id: "36",
    src: "/example_miniature_journey_west.jpeg",
    prompt: "微型立体场景呈现，运用移轴摄影的技法，呈现出Q版【孙悟空三打白骨精】场景",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "37",
    src: "/example_3d_q_snowglobe_couple.jpeg",
    prompt: "将附图中的人物转换成水晶球场景。 整体环境：水晶球放在窗户旁桌面上，背景模糊，暖色调。阳光透过球体，洒下点点金光，照亮了周围的黑暗。 水晶球内部：人物是可爱Q版3D造型，相互之间满眼的爱意。",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "38",
    src: "/example_matryoshka_pearl_earring.png",
    prompt: "把图片人物生成变成 Q 版可爱俄罗斯套娃🪆，大到小一共五个，放在精致的木桌上，横幅4:3比例",
    category: "creative",
    tags: ["俄罗斯套娃", "Q版", "创意变形", "工艺品"]
  },
  {
    id: "39",
    src: "/example_rpg_card_designer.png",
    prompt: "Create a digital character card in RPG collectible style.\nThe subject is a 【Programmer】, standing confidently with tools or symbols relevant to their job.\nRender it in 3D cartoon style, soft lighting, vivid personality.\nInclude skill bars or stats like [Skill1 +x], [Skill2 +x, e.g., Creativity +10, UI/UX +8].\nAdd a title banner on top and a nameplate on the bottom.\nFrame the card with clean edges like a real figure box.\nMake the background fit the profession's theme.\nColors: warm highlights, profession-matching hues.",
    category: "3d-render",
    tags: ["3D","手办"]
  },
  {
    id: "40",
    src: "/example_university_mascot_npu.jpeg",
    prompt: "給【西北工业大学】画一个拟人化的3D Q版美少女形象，体现学校【航空航天航海三航】特色",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "41",
    src: "/example_happy_capsule.png",
    prompt: "标题（大字）：速效快乐胶囊\n\n一颗上为星巴克绿下为透明的小药丸，上面印有星巴克logo，里面有很多咖啡豆\n\n说明（小字）：请在悲伤难过时服用，一日三次，一次两粒\n\n购买按钮 和 药丸颜色一致，下面价格：$9，请遵循医嘱酌情购买",
    category: "logo-branding",
    tags: ["品牌设计", "创意广告", "星巴克", "产品包装"]
  },
  {
    id: "42",
    src: "/example_low_poly_lizard.jpeg",
    prompt: "一个 [subject] 的低多边形 3D 渲染图，由干净的三角形面构成，具有平坦的 [color1] 和 [color2] 表面。环境是一个风格化的数字沙漠，具有极简的几何形状和环境光遮蔽效果。",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "43",
    src: "/example_ordinary_selfie_eason_nicholas.jpeg",
    prompt: "请画一张极其平凡无奇的iPhone 自拍照，没有明确的主体或构图感，就像是随手一拍的快照。照片略带运动模糊，阳光或店内灯光不均导致轻微曝光过度。角度尴尬、构图混乱，整体呈现出一种刻意的平庸感-就像是从口袋里拿手机时不小心拍到的一张自拍。主角是陈奕迅和谢霆锋，晚上，旁边是香港会展中心，在香港维多利亚港旁边。",
    category: "photography",
    tags: ["摄影"]
  },
  {
    id: "44",
    src: "/example_emoji_cushion_pleading.jpeg",
    prompt: "Create a high-resolution 3D render of [🥹] designed as an inflatable, puffy object. The shape should appear soft, rounded, and air-filled — like a plush balloon or blow-up toy. Use a smooth, matte texture with subtle fabric creases and stitching to emphasize the inflatable look. The form should be slightly irregular and squishy, with gentle shadows and soft lighting that highlight volume and realism. Place it on a clean, minimal background (light gray or pale blue), and maintain a playful, sculptural aesthetic.",
    category: "3d-render",
    tags: ["3D","设计"]
  },
  {
    id: "45",
    src: "/example_paper_craft_emoji_fire.jpeg",
    prompt: "A paper craft-style \"🔥\" floating on a pure white background. The emoji is handcrafted from colorful cut paper with visible textures, creases, and layered shapes. It casts a soft drop shadow beneath, giving a sense of lightness and depth. The design is minimal, playful, and clean — centered in the frame with lots of negative space. Use soft studio lighting to highlight the paper texture and edges.",
    category: "creative",
    tags: ["纸艺", "手工", "表情符号", "极简设计"]
  },
  {
    id: "46",
    src: "/example_passport_stamp_beijing.jpeg",
    prompt: "创建一个逼真的护照页，并盖上[北京, 中国]的入境章。章面应以粗体英文写明'欢迎来到北京'，并设计成圆形或椭圆形，并带有装饰性边框。章面应包含'ARRIVAL'字样和一个虚构的日期，例如'2025年4月16日'。在章面中加入{故宫}的微妙轮廓作为背景细节。使用深蓝色或红色墨水并略加晕染，以增强真实感。章面应略微倾斜，如同手工压印。护照页应清晰可见纸张纹理和安全图案",
    category: "product-design",
    tags: ["设计"]
  },
  {
    id: "47",
    src: "/example_lara_croft_card_break.jpeg",
    prompt: "一幅超写实、电影感的插画，描绘了劳拉·克劳馥动态地撞穿一张'考古探险'集换卡牌的边框。她正处于跳跃中或用绳索摆荡，穿着标志性的冒险装备，可能正在使用双枪射击，枪口的火焰帮助将卡牌古老的石雕边框震碎，在破口周围制造出可见的维度破裂效果，如能量裂纹和空间扭曲，使灰尘和碎片四散飞溅。她的身体充满活力地向前冲出，带有明显的运动深度，突破了卡牌的平面，卡牌内部（背景）描绘着茂密的丛林遗迹或布满陷阱的古墓内部。卡牌的碎屑与 crumbling 的石头、飞舞的藤蔓、古钱币碎片和用过的弹壳混合在一起。'考古探险'的标题和'劳拉·克劳馥'的名字（带有一个风格化的文物图标）在卡牌剩余的、布满裂纹和风化痕迹的部分上可见。充满冒险感的、动态的灯光突出了她的运动能力和危险的环境。",
    category: "logo-branding",
    tags: ["插画"]
  },
  {
    id: "48",
    src: "/example_fashion_design_cover.jpeg",
    prompt: "一位美丽的女子身穿粉色旗袍，头戴精致的花饰，秀发中点缀着色彩缤纷的花朵，颈间装饰着优雅的白色蕾丝领子。她的一只手轻托着几只大型蝴蝶。整体拍摄风格呈现高清细节质感，类似时尚杂志封面设计，照片上方中央位置标有文字'FASHION DESIGN'。画面背景采用简约的纯浅灰色，以突出人物主体。",
    category: "poster-design",
    tags: ["摄影","设计"]
  },
  {
    id: "49",
    src: "/example_voxel_icons.jpeg",
    prompt: "三个步骤\n1. 上传参考图\n2. 上传要转换的照片\n3. 提示词：将图片/描述/emoji转换为参考图一样的体素 3D 图标，Octane 渲染，8k",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "50",
    src: "/example_esc_keycap_diorama.jpeg",
    prompt: "一个超写实的等距视角 3D 渲染图，展示了一个微型电脑工作室，它位于一个半透明的机械键盘键帽内，该键帽特别放置在一个真实的哑光表面机械键盘的 'ESC' 键上。键帽内部，一个小人穿着舒适的有纹理连帽衫，坐在现代人体工学椅子上，正在一个发光的超逼真电脑屏幕前工作。环境充满了逼真的微型科技配件：真实材质的台灯、带有反光的显示器、微小的扬声器格栅、缠绕的电线和陶瓷杯子。场景底部由泥土、岩石和苔藓构成，具有照片级的纹理和瑕疵。键帽内部的光线模仿自然的清晨阳光，投下柔和的阴影和温暖的色调，而外部则有来自周围键盘的冷色调环境反射。单词'ESC'以微弱的磨砂玻璃效果巧妙地蚀刻在半透明键帽的顶部——根据角度仅勉强可见。周围的键盘按键如 F1、Q、Shift 和 CTRL 清晰、有纹理，并具有照片级的逼真光照。拍摄效果如同使用高端手机相机，具有浅景深、完美的白平衡和电影般的细节。",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "51",
    src: "/example_family_wedding_photo_q.jpeg",
    prompt: "将照片里的转换成Q版 3D人物，父母婚礼服饰，孩子是美丽的花童。 父母，西式婚礼服饰，父亲礼服，母亲婚纱。孩子手捧鲜花。 背景是五彩鲜花做的拱门。 除了人物是3D Q版，环境其他都是写实。 整体放在一个相框里。",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "52",
    src: "/example_hand_drawn_infographic_cognition.jpeg",
    prompt: "创作一张手绘风格的信息图卡片，比例为9:16竖版。卡片主题鲜明，背景为带有纸质肌理的米色或米白色，整体设计体现质朴、亲切的手绘美感。\n\n卡片上方以红黑相间、对比鲜明的大号毛笔草书字体突出标题，吸引视觉焦点。文字内容均采用中文草书，整体布局分为2至4个清晰的小节，每节以简短、精炼的中文短语表达核心要点。字体保持草书流畅的韵律感，既清晰可读又富有艺术气息。周边适当留白。\n\n卡片中点缀简单、有趣的手绘插画或图标，例如人物或象征符号，以增强视觉吸引力，引发读者思考与共鸣。\n整体布局注意视觉平衡，预留足够的空白空间，确保画面简洁明了，易于阅读和理解。\n\n<h1><span style='color:red'>'认知'</span>决定上限\n<span style='color:red'>'圈子'</span>决定机会</h1>\n- 你赚不到'认知'以外的钱，\n- 也遇不到'圈子'以外的机会。",
    category: "product-design",
    tags: ["插画","设计"]
  },
  {
    id: "53",
    src: "/example_fluffy_pumpkin.jpeg",
    prompt: "将一个简单平面的矢量图标 [🎃] 转化为柔软、立体、毛茸茸的可爱物体。整体造型被浓密的毛发完全覆盖，毛发质感极其真实，带有柔和的阴影。物体居中悬浮于干净的浅灰色背景中，轻盈漂浮。整体风格超现实，富有触感和现代感，带来舒适和俏皮的视觉感受。采用摄影棚级灯光，高分辨率渲染，比例为1:1。",
    category: "3d-render",
    tags: ["3D","摄影","创意"]
  },
  {
    id: "54",
    src: "/example_8bit_pixel_burger.jpeg",
    prompt: "创建一个 [🍔] 的极简 8 位像素标志，居中放置在纯白背景上。使用有限的复古调色板，带有像素化细节、锐利边缘和干净的块状形态。该标志应简洁、具有标志性，并能在像素艺术风格中清晰识别——灵感来自经典街机游戏美学。",
    category: "pixel-art",
    tags: ["像素","插画"]
  },
  {
    id: "55",
    src: "/example_cloud_art_dragon_great_wall.png",
    prompt: "生成一张照片：捕捉了白天的场景，天空中散落的云彩组成了 [主体/物体] 的形状，位于 [地点] 的上方。",
    category: "photography",
    tags: ["摄影"]
  },
  {
    id: "56",
    src: "/example_miniature_starbucks_cup_building.png",
    prompt: "3D Q版迷你风格，一个充满奇趣的迷你星巴克咖啡馆，外观就像一个巨大的外带咖啡杯，还有盖子和吸管。建筑共两层，大大的玻璃窗清晰地展示出内部温馨而精致的设计：木质的家具、温暖的灯光以及忙碌的咖啡师们。街道上有可爱的小人偶漫步或坐着，四周布置着长凳、街灯和植物盆栽，营造出迷人的城市一角。整体采用城市微缩景观风格，细节丰富、逼真，画面光线柔和、呈现出午后的惬意感受。",
    category: "3d-render",
    tags: ["3D","设计"]
  },
  {
    id: "57",
    src: "/example_8bit_pixel_beer.png",
    prompt: "创建一个极简主义的 8 位像素风格的 [🍔] 标志，居中放置在纯白背景上。使用有限的复古调色板，搭配像素化细节、锐利边缘和干净的块状形态。标志应简洁、具有标志性，并能在像素艺术风格中清晰识别——灵感来自经典街机游戏美学。",
    category: "pixel-art",
    tags: ["像素","插画"]
  },
  {
    id: "58",
    src: "/example_cloud_art_dragon_great_wall_58.png",
    prompt: "生成一张照片：捕捉了白天的场景，天空中散落的云彩组成了 [主体/物体] 的形状，位于 [地点] 的上方。",
    category: "photography",
    tags: ["摄影"]
  },
  {
    id: "59",
    src: "/example_vector_poster_london.png",
    prompt: "地点是\"英国伦敦\"，生成一张夏季的彩色矢量艺术海报，顶部有大的\"LONDON\"标题，下方有较小的\"UNITED KINGDOM\"标题",
    category: "poster-design",
    tags: ["矢量艺术", "旅游海报", "城市宣传", "英国"]
  },
  {
    id: "60",
    src: "/example_tufted_rug_star_emoji.png",
    prompt: "创建一张图像，展示一个彩色、手工簇绒的地毯，形状为 🦖 表情符号，铺设在一个简约的地板背景上。地毯设计大胆、俏皮，具有柔软蓬松的质感和粗线条的细节。从上方俯拍，使用自然光照，整体风格略带古怪的 DIY 美感。色彩鲜艳，轮廓卡通化，材质具触感且温馨舒适——类似于手工簇绒艺术地毯。",
    category: "product-design",
    tags: ["插画","设计"]
  },
  {
    id: "61",
    src: "/example_fake_tweet_einstein.png",
    prompt: "爱因斯坦刚刚完成相对论后发布的一条超写实风格的推文。包含一张自拍照，照片中清晰可见背景中的粉笔板和潦草的公式。推文下方显示尼古拉·特斯拉点赞了该内容。",
    category: "photography",
    tags: ["摄影"]
  },
  {
    id: "62",
    src: "/example_enamel_pins_einstein.png",
    prompt: "将附图中的人物转换成可爱的珐琅徽章风格。使用光亮金属描边和鲜艳的珐琅填色。不添加任何额外元素。方形效果图格式，白色背景。",
    category: "logo-branding",
    tags: ["珐琅徽章", "金属工艺", "品牌设计", "收藏品"]
  },
  {
    id: "63",
    src: "/example_ice_cream_emoji_strawberry.png",
    prompt: "生成图片：将【🍓】变成变成一根奶油雪糕，奶油在雪糕顶上呈曲线流动状看起来美味可口，45度悬浮在空中，q版 3d 可爱风格，一致色系的纯色背景",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "64",
    src: "/example_steampunk_fish.jpg",
    prompt: "一个蒸汽朋克风格的机械鱼，身体为黄铜风格，可以清楚的看到其动作时的机械齿轮结构。能略微看到它的机械牙齿，整齐并且紧闭，上下牙齿都可以看到。每颗牙齿均呈三角状，材质为金刚石。尾鳍为金属丝编织结构，其它部分的鱼鳍是半透明的琥珀色玻璃，其中有一些不太明显的气泡。眼睛是多面红宝石，能清晰的看到它反射出来的光泽。鱼有身上能清晰的看到\"f-is-h\"字样，其中字母全部为小写，并且注意横线位置。图片是正方形的，整个画面中可以看到鱼的全身，在画面正中，鱼头向右，并且有一定的留白画面并不局促，画面的左右留出更多的空间。背景中有淡淡的蒸汽朋克风的齿轮纹理。整个鱼看起非常炫酷。这是一张高清图片，整张照片的细节非常丰富，并且有独特的质感与美感。画面不要太暗。",
    category: "3d-render",
    tags: ["蒸汽朋克", "机械", "科幻", "精细渲染"]
  },
  {
    id: "65",
    src: "/surreal-underwater-scene-popsicle.png",
    prompt: "倾斜的第一人称视角拍摄，一只手握着一支超现实的冰棒。冰棒有着透明的蓝色外壳，里面展现了一个水下场景：一个小潜水员、几条小鱼和漂浮的气泡，还有翻滚的海浪，一根绿色的冰棒棍贯穿中心。冰棒略微融化，底部是一根木棍，手正握着这根木棍。背景是柔焦的纽约街景，采用高端产品摄影风格。",
    category: "product-design",
    tags: ["摄影","创意"]
  },
  {
    id: "66",
    src: "/example_silk_creation_universe.png",
    prompt: "将 {❄️} 变成一个柔软的 3D 丝绸质感物体。整个物体表面包裹着顺滑流动的丝绸面料，带有超现实的褶皱细节、柔和的高光与阴影。该物体轻轻漂浮在干净的浅灰色背景中央，营造出轻盈优雅的氛围。整体风格超现实、触感十足且现代，传递出舒适与精致趣味的感觉。工作室灯光，高分辨率渲染。",
    category: "3d-render",
    tags: ["3D","创意"]
  },
  {
    id: "67",
    src: "/example_Ultra_realistic_3D_game.png",
    prompt: "超写实的 3D 渲染画面，重现了2008年《命令与征服：红色警戒3》中娜塔莎的角色设计，完全依照原版建模。场景设定在一个昏暗杂乱的2008年代卧室里，角色正坐在地毯上，面对一台正在播放《命令与征服：红色警戒3》的老式电视和游戏机手柄。整个房间充满了2008年代的怀旧氛围：零食包装袋、汽水罐、海报以及纠缠在一起的电线。娜塔莎·沃尔科娃在画面中被抓拍到转头的一瞬，回眸看向镜头，她那标志性的空灵美丽面容上带着一抹纯真的微笑。她的上半身微微扭转，动态自然，仿佛刚刚被闪光灯惊到而做出的反应。闪光灯轻微地过曝了她的脸和衣服，使她的轮廓在昏暗的房间中更加突出。整张照片显得原始而自然，强烈的明暗对比在她身后投下深邃的阴影，画面充满触感，带有一种真实的2008年胶片快照的模拟质感。",
    category: "3d-render",
    tags: ["3D","摄影","海报","设计"]
  },
  {
    id: "68",
    src: "/example_trading_card_logo_tesla.png",
    prompt: "一张未来主义交易卡，具有黑暗、情绪化的霓虹美学和柔和的科幻照明。卡片采用半透明的圆角矩形，边缘发出柔和的光芒，看起来像全息玻璃制成。中心是一个大型发光的Tesla标志，用红色、白色和深灰色的平滑渐变照明。卡片表面有微妙的反射，带有轻微的光泽效果。背景是深色碳纤维纹理，边缘有柔和的环境光晕。添加从顶部对角线流下的微妙光线，营造柔和的电影光效。文字元素包括左上角的'TSLA'，底部显示'Tesla Inc.'、序列号'#0006'、收入徽章'$96.8B'和年份'2025'。",
    category: "logo-branding",
    tags: ["交易卡", "未来主义", "霓虹效果", "Tesla"]
  },
  {
    id: "69",
    src: "/example_silhouette_art.png",
    prompt: "一个 [PROMPT] 的基础轮廓剪影。背景为亮黄色，剪影为纯黑色实心填充。",
    category: "creative",
    tags: ["剪影艺术", "极简设计", "对比色彩", "图形设计"]
  },
  {
    id: "70",
    src: "/example_pokemon_strawbit.png",
    prompt: "根据此物体（提供的照片）创作一个原创生物。该生物应看起来像是属于一个奇幻怪物捕捉宇宙，具有受复古日式RPG怪物艺术影响的可爱或酷炫设计。图像必须包含：生物的全身视图，灵感来自物体的形状、材料或用途。在其脚边有一个小球体或胶囊（类似于精灵球），其设计图案和颜色与物体的外观相匹配——不是标准的精灵球，而是自定义设计。为生物发明的名字，显示在其旁边或下方。其元素类型（例如火、水、金属、自然、电……），基于物体的核心属性。插图应看起来像是来自奇幻生物百科全书，线条清晰，阴影柔和，设计富有表现力且以角色为驱动。",
    category: "product-design",
    tags: ["摄影","插画","设计"]
  },
  {
    id: "71",
    src: "/example_cyberpunk_tilt_shift_miniature.jpg",
    prompt: "從上方俯瞰的超高細節迷你【Cyberpunk】景觀，採用傾斜移軸鏡頭效果。場景中充滿如玩具般的元素，全部以高解析度 CG 呈現。光線戲劇化，營造出大片的氛圍，色彩鮮明，對比強烈，強調景深效果與擬真微觀視角，使觀者仿佛俯瞰一個玩具世界般的迷你現實，畫面中包含大量視覺笑點與極具重複觀看價值的細節設計",
    category: "creative",
    tags: ["赛博朋克", "移轴摄影", "微缩景观", "CG渲染"]
  },
  {
    id: "72",
    src: "/gold_pendant_necklace.png",
    prompt: "一张照片级写实的特写图像，展示一条由女性手握持的金质吊坠项链。吊坠上刻有 [图像 / 表情符号] 的浮雕图案，悬挂在一条抛光金链上。背景为柔和虚化的中性米色调，采用自然光照，肤色真实，风格为产品摄影，画面比例为 16:9。",
    category: "product-design",
    tags: ["摄影"]
  },
  {
    id: "73",
    src: "/example_keychain_chibi.png",
    prompt: "一张特写照片，展示一个被人手握住的可爱多彩钥匙串。钥匙串的造型为 [参考图片] 的 Q 版风格。钥匙串由柔软橡胶材质制成，带有粗黑描边，连接在一个小巧的银色钥匙圈上，背景为中性色调。",
    category: "photography",
    tags: ["摄影"]
  },
  {
    id: "74",
    src: "/example_logo_bookshelves.png",
    prompt: "拍摄一张现代书架的照片，其造型灵感来源于 [LOGO] 的形状。书架由流畅、互相连接的曲线构成，形成多个大小不一的分区。整体材质为光滑的哑光黑色金属，曲线内部设有木质层板。柔和暖色的 LED 灯带勾勒出内侧曲线轮廓。书架安装在一个中性色调的墙面上，上面摆放着色彩丰富的书籍、小型绿植和极简风格的艺术摆件。整体氛围富有创意、优雅且略带未来感。",
    category: "logo-branding",
    tags: ["摄影","创意","插画"]
  },
  {
    id: "75",
    src: "/example_instagram_frame_pearl_earring.png",
    prompt: "根据所附照片创建一个风格化的3D Q版人物角色，准确保留人物的面部特征和服装细节。角色的左手比心（手指上方有红色爱心元素），姿势俏皮地坐在一个巨大的Instagram相框边缘，双腿悬挂在框外。相框顶部显示用户名『Beauty』，四周漂浮着社交媒体图标（点赞、评论、转发）。",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "76",
    src: "/example_anime_nostalgic_poster.png",
    prompt: "{The Lord of the Rings} 风格的动漫电影海报，动漫画风为《恶魔高中 DXD（High School DXD）》风格。海报上可见明显的折痕痕迹，因长时间反复折叠，造成部分区域出现褶皱处的物理性损伤和擦痕，颜色也在某些地方出现了褪色。表面遍布无规律的折痕、翻折印记与划痕，这些都是在不断搬动过程中逐渐积累的微小损耗，如同熵增不可逆的过程在不断扩展。然而，留存在我们心中的美好记忆却始终完整无缺。当你凝视这张充满怀旧氛围的海报时，所感受到的，正是那些随时间累积、变得无比珍贵的收藏品所承载的情感本质。",
    category: "poster-design",
    tags: ["手办","动漫","海报"]
  },
  {
    id: "77",
    src: "/example_crystal_ball_chang_e.png",
    prompt: "一枚精致的水晶球静静摆放在窗户旁温暖柔和的桌面上，背景虚化而朦胧，暖色调的阳光轻柔地穿透水晶球，折射出点点金光，温暖地照亮了四周的微暗空间。水晶球内部自然地呈现出一个以 {嫦娥奔月} 为主题的迷你立体世界，细腻精美而梦幻的3D景观，人物与物体皆是可爱的Q版造型，精致而美观，彼此之间充满灵动的情感互动。整体氛围充满了东亚奇幻色彩，细节极为丰富，呈现出魔幻现实主义般的奇妙质感。整个场景如诗如梦，华美而典雅，散发着温馨柔和的光芒，仿佛在温暖的光影中被赋予了生命。",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "78",
    src: "/example_retexture_glass_phone.png",
    prompt: "根据下面的JSON重新纹理化附加的图像：{\"style\": \"photorealistic\", \"material\": \"glass\", \"background\": \"plain white\", \"object_position\": \"centered\", \"lighting\": \"soft, diffused studio lighting\", \"camera_angle\": \"eye-level, straight-on\", \"resolution\": \"high\", \"aspect_ratio\": \"2:3\", \"details\": {\"reflections\": true, \"shadows\": false, \"transparency\": true}}",
    category: "3d-render",
    tags: ["玻璃材质", "重新纹理", "写实渲染", "产品设计"]
  },
  {
    id: "79",
    src: "/example_lego_shanghai_bund.png",
    prompt: "创建一幅高度精细且色彩鲜艳的乐高版上海外滩景象。前景呈现经典的外滩历史建筑群，用乐高砖块精致还原西式与新古典主义风格的建筑立面，包括钟楼、穹顶、柱廊等细节。乐高小人们正在沿江漫步、拍照、观光，街道两旁停靠着经典样式的乐高汽车。背景是壮观的黄浦江，以蓝色半透明乐高砖拼接，江面上有乐高渡轮和游览船。对岸的浦东陆家嘴高楼林立，包括东方明珠塔、上海中心、金茂大厦和环球金融中心，这些超现代乐高摩天大楼色彩丰富、造型逼真。天空为乐高明亮蓝色，点缀少量白色乐高积木云朵，整体呈现充满活力与现代感的视觉效果。",
    category: "creative",
    tags: ["乐高", "上海外滩", "建筑", "微缩模型"]
  },
  {
    id: "80",
    src: "/example_business_card_code_style.png",
    prompt: "特写镜头：一只手正拿着一张设计成 VS Code 中 JSON 文件外观的名片。名片上的代码以真实的 JSON 语法高亮格式呈现。窗口界面包含典型的工具栏图标和标题栏，标题显示为 Business Card.json，整体风格与 VS Code 界面完全一致。背景略微虚化，突出展示名片内容。名片上的 JSON 代码如下所示：{\"name\": \"Jamez Bondos\", \"title\": \"Your Title\", \"email\": \"your@email.com\", \"link\": \"yourwebsite\"}",
    category: "ui-design",
    tags: ["VS Code", "名片设计", "代码风格", "创意设计"]
  },
  {
    id: "81",
    src: "/example_3d_isometric_room_81.png",
    prompt: "将附图变换为柔软的3D半透明玻璃，具有磨砂哑光效果和细致的纹理，原始色彩，以浅灰色背景为中心，在空间中轻轻漂浮，柔和的阴影，自然的光线",
    category: "3d-render",
    tags: ["3D"]
  },
  {
    id: "82",
    src: "/example_sticker_pack_emoji_82.png",
    prompt: "以清晰的45°俯视角度，展示一个等距微缩模型场景，内容为[上海东方明珠塔、外滩]等城市特色建筑，天气效果巧妙融入场景中，柔和的多云天气与城市轻柔互动。使用基于物理的真实渲染（PBR）和逼真的光照效果，纯色背景，清晰简洁。画面采用居中构图，凸显出三维模型精准而细腻的美感。在图片上方展示\"[上海 多云 20°C]\"，并附有多云天气图标。",
    category: "3d-render",
    tags: ["微缩模型", "城市建筑", "天气效果", "上海"]
  },
  {
    id: "83",
    src: "/example_vintage_travel_poster_83.png",
    prompt: "一幅数字插画，描绘了一个 [SUBJECT]，其结构由一组发光、干净且纯净的蓝色线条勾勒而成。画面设定在深色背景之上，以突出 [SUBJECT] 的形态与特征。某个特定部位，如 [PART]，通过红色光晕加以强调，以表示该区域的重要性或特殊意义。整体风格兼具教育性与视觉吸引力，设计上仿佛是一种先进的成像技术。",
    category: "product-design",
    tags: ["插画","设计"]
  },
  {
    id: "84",
    src: "/example_neon_sign_logo_84.png",
    prompt: "创建图片 一个可爱Q版的硅胶护腕托，外形基于【🐼】表情，采用柔软的食品级硅胶材质，表面为亲肤哑光质感，内部填充慢回弹棉，拟人化卡通风格，表情生动，双手张开趴在桌面上，呈现出拥抱手腕的姿势，整体造型圆润软萌，颜色为【🐼】配色，风格治愈可爱，适合办公使用，背景为白色纯色，柔和布光，产品摄影风格，前视角或45度俯视，高清细节，突出硅胶质感与舒适功能",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "85",
    src: "/example_food_packaging_design_85.png",
    prompt: "一幅铅笔素描画，描绘了 [Subject 1] 与 [Subject 2] 互动的场景，其中 [Subject 2] 以逼真的全彩风格呈现，与 [Subject 1] 及背景的手绘素描风格形成超现实的对比。",
    category: "illustration",
    tags: ["创意","插画"]
  },
  {
    id: "86",
    src: "/example_case_86.png",
    prompt: "双重曝光，Midjourney 风格，融合、混合、叠加的双重曝光图像，双重曝光风格。一幅由 Yukisakura 创作的杰出杰作，展现了一个奇妙的双重曝光构图，将阿拉贡·阿拉松之子的剪影与生机勃勃春季里中土世界视觉上引人注目、崎岖的地貌和谐地交织在一起。沐浴阳光的松树林、山峰和一匹孤独的马穿过小径的景象从他身形的纹理中向外回响，增添了叙事和孤独的层次感。当简洁分明的单色背景保持着锐利的对比度时，美妙的张力逐渐形成，将所有焦点吸引到层次丰富的双重曝光上。其特点是阿拉贡剪影内部充满活力的全彩色方案，以及用情感的精确性描摹每个轮廓的清晰、刻意的线条。(Detailed:1.45). (Detailed background:1.4).",
    category: "creative",
    tags: ["双重曝光", "奇幻", "合成艺术", "电影风格"]
  },
  {
    id: "87",
    src: "/example_case_87.png",
    prompt: "在字母中融入单词的含义，将图形和字母巧妙融合在一起。单词：{ beautify } 下面加上单词的简要说明",
    category: "logo-branding",
    tags: ["字体设计", "创意字母", "品牌设计", "视觉传达"]
  },
  {
    id: "88",
    src: "/example_case_88.png",
    prompt: "一张黑白线描涂色插画，适合直接打印在标准尺寸（8.5x11英寸）的纸张上，无纸张边框。整体插画风格清新简洁，使用清晰流畅的黑色轮廓线条，无阴影、无灰阶、无颜色填充，背景纯白，便于涂色。【同时为了方便不会涂色的用户，请在右下角用小图生成一个完整的彩色版本供参考】适合人群：【6-9岁小朋友】画面描述：【一只独角兽在森林的草地上漫步，阳光明媚，蓝天白云】",
    category: "illustration",
    tags: ["插画"]
  },
  {
    id: "89",
    src: "/example_case_89.png",
    prompt: "高精度的 3D 渲染图，按照 emoji 图标 {👍} 展示一个金属质感的徽章，固定在竖直的商品卡片上，具有超光滑的镀铬质感和圆润的 3D 图标造型，风格化的未来主义设计，带有柔和的反光与干净的阴影。纸质卡片顶部中央带有一个冲切的欧式挂孔，徽章上方是醒目的标题 \"{Awesome}\"，下方配有趣味标语 \"{Smash that ⭐ if you like it!}\"。背景为柔和的灰色，使用柔光摄影棚灯光，整体风格极简。",
    category: "product-design",
    tags: ["徽章设计", "3D渲染", "金属质感", "产品包装"]
  },
  {
    id: "90",
    src: "/example_case_90.png",
    prompt: "一个超逼真的3D渲染图，展示了四个机械键盘键帽，排列成紧密的2x2网格，所有键帽相互接触。从等轴测角度观察。一个键帽是透明的，上面用红色印刷着\"{just}\"字样。另外三个键帽采用颜色：{黑色、紫色和白色}。一个键帽上带有Github的Logo。另外两个键帽上分别写着\"{fork}\"和\"{it}\"。逼真的塑料纹理，圆润的雕刻键帽，柔和的阴影，干净的浅灰色背景。",
    category: "product-design",
    tags: ["键盘", "机械键盘", "3D渲染", "产品设计"]
  },
  {
    id: "91",
    src: "/example_case_91.png",
    prompt: "将图像转换为绘制在古老羊皮纸上的古代藏宝图。地图包含详细的元素，如海洋上的帆船、海岸线上的古老港口或城堡、通向标记宝藏地点的大\"X\"的虚线路径、山脉、棕榈树和装饰性的罗盘玫瑰。整体风格让人联想到旧时的海盗冒险电影。",
    category: "creative",
    tags: ["藏宝图", "古地图", "冒险", "复古设计"]
  },
  {
    id: "92",
    src: "/example_case_92.png",
    prompt: "超写实，从上往下俯视角拍摄，一个美丽的ins模特【安妮海瑟薇 / 见参考图片】，有着精致美丽的妆容和时尚的造型，站在一部被人托起的智能手机屏幕上，画面营造出强烈的透视错觉。强调女孩从手机中站出来的三维效果。她戴着黑框眼镜，穿着高街风，俏皮地摆着可爱的pose。手机屏幕被处理成深色地板，像是一个小舞台。场景使用强烈的强制透视（forced perspective）表现手掌、手机与女孩之间的比例差异。背景为干净的灰色，使用柔和室内光，浅景深，整体风格为超现实写实合成。透视特别强",
    category: "photography",
    tags: ["创意"]
  },
  {
    id: "93",
    src: "/example_case_93.png",
    prompt: "对参考图片进行重新纹理化，基于下方的 JSON 美学定义：{\"style\": \"photorealistic 3D render\", \"material\": \"glass with transparent and iridescent effects\", \"surface_texture\": \"smooth, polished with subtle reflections and refractive effects\", \"lighting\": {\"type\": \"studio HDRI\", \"intensity\": \"high\", \"direction\": \"angled top-left key light and ambient fill\", \"accent_colors\": [\"blue\", \"green\", \"purple\"], \"reflections\": true, \"refractions\": true, \"dispersion_effects\": true, \"bloom\": true}, \"color_scheme\": {\"primary\": \"transparent with iridescent blue, green, and purple hues\", \"secondary\": \"crystal-clear with subtle chromatic shifts\", \"highlights\": \"soft, glowing accents reflecting rainbow-like effects\", \"rim_light\": \"soft reflective light around edges\"}, \"background\": {\"color\": \"black\", \"vignette\": true, \"texture\": \"none\"}, \"post_processing\": {\"chromatic_aberration\": true, \"glow\": true, \"high_contrast\": true, \"sharp_details\": true}}",
    category: "3d-render",
    tags: ["玻璃材质", "彩虹效果", "重新纹理", "艺术渲染"]
  },
  {
    id: "94",
    src: "/example_case_94.png",
    prompt: "三只[动物类型]在标志性[地标]前的特写自拍照，它们表情各异，拍摄于黄金时刻，采用电影般的灯光。动物们靠近镜头，头挨着头，模仿自拍姿势，展现出喜悦、惊讶和平静的表情。背景展示了[地标]完整的建筑细节，光线柔和，氛围温暖。采用摄影感、写实卡通风格拍摄，高细节，1:1 宽高比。",
    category: "logo-branding",
    tags: ["摄影"]
  },
  {
    id: "95",
    src: "/example_case_95.png",
    prompt: "将这张照片变成一个摇头娃娃：头部稍微放大，保持面部准确，身体卡通化。[把它放在书架上]。",
    category: "illustration",
    tags: ["摄影"]
  },
  {
    id: "96",
    src: "/example_case_96.png",
    prompt: "生成一张摆放于桌面上的动漫风格手办照片，以日常随手用手机拍摄的轻松休闲视角呈现。手办模型以附件中人物照片为基础，精确还原照片中人物的全身姿势、面部表情以及服装造型，确保手办全身完整呈现。整体设计精致细腻，头发与服饰采用自然柔和的渐变色彩与细腻质感，风格偏向日系动漫风，细节丰富，质感真实，观感精美。",
    category: "product-design",
    tags: ["手办","动漫","摄影","设计"]
  },
  {
    id: "97",
    src: "/example_case_97.png",
    prompt: "一张特写、构图专业的照片，展示一个手工钩织的毛线玩偶被双手轻柔地托着。玩偶造型圆润，【上传图片】人物得可爱Q版形象，色彩对比鲜明，细节丰富。持玩偶的双手自然、温柔，手指姿态清晰可见，皮肤质感与光影过渡自然，展现出温暖且真实的触感。背景轻微虚化，表现为室内环境，有温暖的木质桌面和从窗户洒入的自然光，营造出舒适、亲密的氛围。整体画面传达出精湛的工艺感与被珍视的温馨情绪。",
    category: "3d-render",
    tags: ["3D","摄影"]
  },
  {
    id: "98",
    src: "/example_case_98.png",
    prompt: "一张黑白照片，展示了一个[主体]在磨砂或半透明表面后的模糊剪影。其[部分]轮廓清晰，紧贴表面，与其余朦胧、模糊的身影形成鲜明对比。背景是柔和的灰色渐变色调，增强了神秘和艺术的氛围。",
    category: "illustration",
    tags: ["摄影","插画"]
  },
  {
    id: "99",
    src: "/example_case_99.png",
    prompt: "高分辨率的黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面右侧，一个模糊却惊艳的哈利波特面容从阴影中隐约浮现，并非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部只露出一部分：也许是一个眼睛、一块颧骨，还有唇角的轮廓，唤起神秘、亲密与优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美，却不显矫饰。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点——这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有光影与情绪交织。整体氛围抽象却深具人性，仿佛一瞥即逝的目光，或半梦半醒间的记忆：亲密、永恒、令人怅然的美。",
    category: "logo-branding",
    tags: ["摄影","插画"]
  },
  {
    id: "100",
    src: "/example_case_100.png",
    prompt: "一则简约且富有创意的广告，设置在纯白背景上。一个真实的 [真实物体] 与手绘黑色墨水涂鸦相结合，线条松散而俏皮。涂鸦描绘了：[涂鸦概念及交互：以巧妙、富有想象力的方式与物体互动]。在顶部或中部加入粗体黑色 [广告文案] 文字。在底部清晰放置 [品牌标志]。视觉效果应简洁、有趣、高对比度且构思巧妙。",
    category: "poster-design",
    tags: ["创意","插画"]
  },
  {
    id: "101",
    src: "/example_case_101.png",
    prompt: "以附上的自拍照为精确参照，生成一张专业肖像照，100%保留我的面部特征（包括脸型、发型、肤色和表情），头部端正。采用影棚级灯光与柔和的中性背景，将我的着装调整为正式职业装束，确保整张照片既彰显自信又透出亲和力，适合用作领英个人资料，图片比例3：4",
    category: "portrait",
    tags: ["专业肖像", "职业形象", "影棚摄影", "商务头像"]
  }
]