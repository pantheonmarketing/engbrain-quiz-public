// 10-step quiz card

const STEPS = [
  { id:1, section:'คุณคือใคร?', badgeTone:'coral',
    title:'เริ่มจากคุณก่อนนะคะ ใครเป็นคนทำแบบทดสอบนี้?',
    subtitle:'เพื่อให้ครูโบว์แนะนำคอร์สที่เหมาะที่สุดได้ค่ะ',
    kind:'radio',
    options:[
      { v:'parent',  e:'👨‍👩‍👧', label:'ฉันเป็นผู้ปกครอง', desc:'อยากพัฒนาภาษาอังกฤษให้ลูก' },
      { v:'mom',     e:'🌸',     label:'ฉันอยากพัฒนาภาษาอังกฤษของตัวเอง', desc:'อยากเป็นต้นแบบที่ดีให้ลูก' },
      { v:'teacher', e:'📚',     label:'ฉันเป็นครู', desc:'อยากนำหลักสูตรครูโบว์ไปใช้กับนักเรียน' },
    ],
    coach:{
      parent:'เยี่ยมมากค่ะ เดี๋ยวครูโบว์จะช่วยวางแผนให้เหมาะกับลูกของคุณ ขอถามอีกไม่กี่ข้อนะคะ',
      mom:'แนวคิดดีมากค่ะ 🌸 คุณแม่ที่เรียนไปพร้อมลูกมักช่วยให้ลูกก้าวหน้าเร็วขึ้น เดี๋ยวครูโบว์ขอถามคำถาม SmartMom สั้น ๆ ก่อนรับคูปองนะคะ',
      teacher:'ดีมากค่ะ ครูโบว์ยินดีช่วยคุณครู เดี๋ยวขอข้อมูลเพิ่มเติมเพื่อส่งรายละเอียดความร่วมมือให้นะคะ',
    }
  },
  { id:2, section:'เกี่ยวกับลูกของคุณ', badgeTone:'mint',
    paths:['parent'],
    title:'เล่าให้ครูโบว์รู้จักลูกของคุณหน่อยค่ะ',
    subtitle:'ขอชื่อเล่น อายุ และระดับชั้นปัจจุบันค่ะ',
    kind:'child-form',
  },
  { id:3, section:'หลักสูตรที่เรียนอยู่', badgeTone:'butter',
    paths:['parent'],
    title:'ตอนนี้ {name} เรียนอยู่หลักสูตรอะไรคะ?',
    kind:'radio',
    options:[
      { v:'thai', e:'🏫', label:'หลักสูตรไทย', desc:'โรงเรียนหลักสูตรไทยทั่วไป' },
      { v:'ep',   e:'🌏', label:'EP · EIP · IEP', desc:'ห้องเรียนภาษาอังกฤษในโรงเรียนไทย' },
      { v:'mep',  e:'🌐', label:'MEP · IP',      desc:'Mini English / Integrated Programme' },
      { v:'inter',e:'✈️', label:'โรงเรียนนานาชาติ', desc:'เรียนหลักสูตรภาษาอังกฤษเต็มรูปแบบ' },
      { v:'prep', e:'🎯', label:'เตรียมสอบเข้า EP / Inter ป.1', desc:'กำลังเตรียมสอบเข้า' },
    ],
    coach:{
      thai:'เด็กหลักสูตรไทยพัฒนาได้ดีมากเมื่อเริ่มจากโฟนิกส์ค่ะ เราจะปูพื้นฐานเสียงที่โรงเรียนไทยมักไม่ได้ลงลึก 💪',
      ep:'ผู้ปกครองสาย EP เป็นกลุ่มใหญ่ของครูโบว์เลยค่ะ โฟนิกส์จะช่วยให้ {name} อ่านมั่นใจขึ้นในไม่กี่สัปดาห์',
      mep:'MEP เป็นสภาพแวดล้อมที่ดีค่ะ โฟนิกส์จะช่วยเติมช่องว่างจากการฝึกอ่าน ให้กลายเป็นความมั่นใจจริง',
      inter:'เด็กอินเตอร์หลายคนจำคำเป็นรูปภาพอย่างเดียว โฟนิกส์จะช่วยให้อ่านคำใหม่และคำยากได้ตลอดชีวิต',
      prep:'การเตรียมสอบเข้าเป็นงานถนัดของครูโบว์ค่ะ มาช่วยให้ {name} พร้อมและโดดเด่นกันนะคะ ✨',
    }
  },
  { id:4, section:'ระดับภาษาอังกฤษ', badgeTone:'sky',
    paths:['parent'],
    title:'{name} รู้เสียงตัวอักษร A–Z ทั้ง 26 เสียงแล้วหรือยังคะ?',
    subtitle:'หมายถึงเสียงของตัวอักษร ไม่ใช่แค่ชื่อ A B C นะคะ',
    kind:'radio',
    options:[
      { v:'none',   e:'🌱', label:'ยังไม่รู้เลย', desc:'เพิ่งเริ่มเรียนเสียงภาษาอังกฤษ' },
      { v:'some',   e:'🌿', label:'รู้บ้างนิดหน่อย', desc:'รู้บางตัว แต่ยังไม่มั่นใจ' },
      { v:'confident', e:'🌳', label:'รู้ครบ 26 เสียงแล้ว และค่อนข้างมั่นใจ', desc:'ออกเสียงตัวอักษรได้ทุกตัว' },
    ],
    coach:{
      none:'เหมาะกับการเริ่มต้นมากค่ะ Level 1 ออกแบบมาเพื่อจุดนี้เลย ไม่กดดัน เรียนเสียงอย่างสนุกค่ะ',
      some:'เด็กส่วนใหญ่อยู่ระดับนี้ค่ะ เราจะช่วยเติมช่องว่างให้แน่นขึ้นในไม่กี่สัปดาห์',
      confident:'เก่งมากค่ะ ขอถามอีกข้อเพื่อหาขั้นต่อไปที่เหมาะที่สุดนะคะ',
    }
  },
  { id:5, section:'ระดับโฟนิกส์ขั้นต่อไป', badgeTone:'coral',
    paths:['parent'],
    title:'ลูกเคยเรียนระบบ Jolly Phonics 44 เสียงมาก่อนหรือยังคะ?',
    subtitle:'ดีมากค่ะ ขอถามอีกข้อเดียว เช่น เคยเรียน 6 เสียงแรก s-a-t-i-p-n แล้วผสมเสียงอ่านคำอย่าง sit, pin, tap ได้หรือยัง',
    kind:'radio',
    showIf: a => a[4] === 'confident',
    options:[
      { v:'never',   e:'🌱', label:'ยังไม่เคยเรียนเลย ใหม่ทั้งหมด' },
      { v:'little',  e:'🎵', label:'เคยลองเรียนบ้าง แต่ยังไม่จบระดับเต็ม' },
      { v:'done',    e:'🎓', label:'เคยเรียนแล้ว ลูกผสมเสียงและอ่านหนังสืออ่านง่ายได้บ้าง' },
    ],
    coach:{
      never:'ไม่เป็นไรค่ะ เราจะเริ่มจาก Level 1 และค่อย ๆ สร้างพื้นฐาน 44 เสียงอย่างเป็นธรรมชาติ 🎶',
      little:'ดีมากค่ะ ครูโบว์จะจัดระดับให้ {name} อยู่จุดที่พอดี แล้วเรียนให้ครบระบบไปด้วยกัน',
      done:'เยี่ยมเลยค่ะ {name} พร้อมไป Level 2 แล้ว ทั้งการผสมเสียง digraphs และ tricky words',
    }
  },
  { id:6, section:'เป้าหมายการเรียน', badgeTone:'mint',
    paths:['parent'],
    title:'สิ่งไหนสำคัญกับคุณที่สุดคะ?',
    subtitle:'เลือกได้มากกว่าหนึ่งข้อ ครูโบว์จะใช้ข้อมูลนี้จัดแผนให้เหมาะค่ะ',
    kind:'check',
    options:[
      { v:'reading',  e:'📖', label:'อ่านเพื่อการเรียน', desc:'จับใจความ คำศัพท์ และอ่านคล่อง' },
      { v:'speak',    e:'🗣️', label:'การพูดและการออกเสียง', desc:'พูดภาษาอังกฤษชัดและมั่นใจ' },
      { v:'ep-exam',  e:'📝', label:'เตรียมสอบเข้า EP', desc:'เตรียมเข้า English Program ป.1' },
      { v:'inter',    e:'🎒', label:'เตรียมพร้อมสำหรับโรงเรียนนานาชาติ', desc:'วางพื้นฐานระยะยาวสำหรับการเรียนภาษาอังกฤษเต็มรูปแบบ' },
      { v:'confidence',e:'✨', label:'สร้างความมั่นใจ', desc:'ให้ลูกรักภาษาอังกฤษ ไม่กลัวภาษาอังกฤษ' },
    ],
    coach:{
      any:'เป้าหมายดีมากค่ะ ครูโบว์จะรวมทุกอย่างให้เป็นแผนเดียวที่เหมาะกับ {name} 🧶',
    }
  },
  { id:7, section:'ช่วงเวลาที่ต้องการเริ่ม', badgeTone:'butter',
    paths:['parent'],
    title:'อยากเริ่มเรียนเมื่อไหร่คะ?',
    kind:'radio',
    options:[
      { v:'now',     e:'🚀', label:'พร้อมเริ่มตอนนี้',            desc:'อยากเริ่มภายในสัปดาห์นี้' },
      { v:'month',   e:'📅', label:'ภายในเดือนหน้า',desc:'วางแผนจะเริ่มเร็ว ๆ นี้' },
      { v:'3month',  e:'🌤️', label:'ภายใน 3 เดือน',      desc:'กำลังวางแผนล่วงหน้า' },
      { v:'research',e:'🔎', label:'กำลังหาข้อมูลอยู่',    desc:'ขอศึกษาข้อมูลก่อน' },
    ],
    coach:{
      now:'ดีมากค่ะ สัปดาห์นี้มีเวลาว่างจำกัด เดี๋ยวครูโบว์ช่วยดูสล็อตที่เหมาะให้ {name} นะคะ',
      month:'กำลังพอดีเลยค่ะ ส่วนใหญ่ครอบครัวจะเริ่มภายใน 2–3 สัปดาห์หลังทำแบบทดสอบนี้',
      '3month':'วางแผนดีมากค่ะ ครูโบว์จะส่งโรดแมปให้ดูเป็นแนวทางนะคะ',
      research:'ดีค่ะ ครูโบว์จะส่งคู่มือสำหรับผู้ปกครองให้ แล้วค่อยตัดสินใจตามจังหวะของครอบครัวได้เลย 💌',
    }
  },
  { id:8, section:'รูปแบบการเรียน', badgeTone:'sky',
    paths:['parent'],
    title:'รูปแบบไหนเหมาะกับ {name} ที่สุดคะ?',
    kind:'radio',
    options:[
      { v:'1on1',  e:'👩‍🏫', label:'เรียนส่วนตัว 1:1 ผ่าน Zoom',    desc:'ได้รับการดูแลเต็มที่จากครูโบว์' },
      { v:'group', e:'👫',   label:'เรียนกับเพื่อน',   desc:'กลุ่ม Zoom 3–4 คน' },
      { v:'video', e:'🎬',   label:'คอร์สวิดีโอ',         desc:'เรียนเองที่บ้านตามเวลา' },
      { v:'books',  e:'📚', label:'เรียนด้วยหนังสือ',       desc:'เรียนจากแบบฝึกหัดที่บ้าน' },
      { v:'unsure',e:'🤷‍♀️', label:'ยังไม่แน่ใจ',              desc:'อยากให้ครูโบว์แนะนำ' },
    ],
    coach:{
      '1on1':'เป็นทางที่เร็วที่สุดค่ะ ครูโบว์ปรับทุกคลาสให้เหมาะกับ {name} ได้เต็มที่ 💎',
      group:'เด็กหลายคนเรียนสนุกขึ้นเมื่อมีเพื่อนค่ะ Group Zoom เป็นรูปแบบที่นิยมมาก',
      video:'เหมาะกับครอบครัวที่เวลายุ่งค่ะ {name} เรียนตามจังหวะของตัวเองได้',
      books:'เป็นตัวเลือกที่ดีค่ะ แบบฝึกหัดช่วยสร้างวินัยและความต่อเนื่อง',
      unsure:'ไม่เป็นไรค่ะ ครูโบว์จะแนะนำตัวเลือกที่เหมาะที่สุดจากข้อมูลทั้งหมดที่คุณให้มา',
    }
  },
  { id:9, section:'งบประมาณการเรียน', badgeTone:'coral',
    paths:['parent'],
    title:'คุณสะดวกลงทุนกับการเรียนของลูกประมาณเท่าไหร่ต่อเดือนคะ?',
    subtitle:'ตอบตามจริงได้เลยค่ะ เพื่อให้ครูโบว์แนะนำคอร์สที่เหมาะกับงบที่สุด ไม่มีการตัดสินแน่นอน',
    kind:'radio',
    options:[
      { v:'<1k',   e:'🌱', label:'น้อยกว่า ฿1,000',    desc:'เน้นประหยัดงบ' },
      { v:'1-3k',  e:'🌼', label:'฿1,000 – ฿3,000',     desc:'คุ้มค่าและเข้าถึงง่าย' },
      { v:'3-6k',  e:'🌻', label:'฿3,000 – ฿6,000',     desc:'พร้อมเรียนอย่างต่อเนื่อง' },
      { v:'6-9k',  e:'🌺', label:'฿6,000 – ฿9,900',     desc:'จริงจังกับผลลัพธ์' },
      { v:'9k+',   e:'🏆', label:'฿9,900+',             desc:'ตั้งใจมาก · ต้องการโปรแกรมที่ดีที่สุด' },
    ],
    coach:{
      '<1k':'เข้าใจค่ะ ครูโบว์จะแนะนำคอร์สวิดีโอที่เหมาะกับงบนี้มากที่สุด',
      '1-3k':'สำหรับ {name} ครูโบว์น่าจะแนะนำ Group Zoom ค่ะ คุ้มค่ามาก',
      '3-6k':'งบนี้เริ่มมีตัวเลือกแบบกึ่งส่วนตัว เป็นจุดที่ลงตัวมากค่ะ',
      '6-9k':'ระดับนี้สามารถดูแลแบบ 1:1 และวางแผนรายสัปดาห์เฉพาะลูกได้ค่ะ',
      '9k+':'เป็นโปรแกรมหลักระดับพรีเมียมค่ะ {name} จะได้รับการดูแลแบบ VIP ผู้ปกครองชอบผลลัพธ์มาก',
    }
  },
  { id:10, section:'ใกล้เสร็จแล้ว', badgeTone:'mint',
    title:'ดูคอร์สที่เหมาะกับคุณได้เลยค่ะ',
    subtitle:'คำแนะนำคอร์สของคุณพร้อมแล้ว กรอกข้อมูลเพื่อดูผลลัพธ์ทันทีค่ะ',
    kind:'contact',
  },
  { id:11, section:'SmartMom', badgeTone:'coral', paths:['mom'],
    title:'อะไรคือสิ่งที่คุณกังวลที่สุดเมื่อต้องพูดภาษาอังกฤษกับลูกคะ?',
    subtitle:'คำตอบนี้ช่วยให้ครูโบว์เข้าใจจุดที่ทำให้คุณไม่มั่นใจจริง ๆ ค่ะ',
    kind:'radio',
    options:[
      { v:'pronunciation', e:'🔊', label:'กลัวออกเสียงผิด', desc:'กลัวลูกได้ยินเสียงที่ไม่ถูกต้อง' },
      { v:'vocabulary', e:'📚', label:'รู้ภาษาอังกฤษไม่พอ', desc:'นึกคำหรือประโยคไม่ออก' },
      { v:'mistakes', e:'🧠', label:'กลัวลูกจำสิ่งที่ผิดจากเรา', desc:'อยากสอนให้ถูกตั้งแต่ต้น' },
      { v:'shy', e:'🙈', label:'รู้สึกเขินหรือไม่กล้า', desc:'พูดภาษาอังกฤษแล้วไม่เป็นธรรมชาติ' },
      { v:'daily', e:'💬', label:'ไม่รู้ว่าจะพูดอะไรกับลูกทุกวัน', desc:'อยากได้กิจวัตรง่าย ๆ ที่ทำตามได้' },
    ],
    coach:{ pronunciation:'SmartMom เริ่มจากเสียงที่ชัดเจนก่อน เพื่อให้คุณรู้ว่าควรออกเสียงภาษาอังกฤษที่บ้านอย่างไร', vocabulary:'ไม่เป็นไรค่ะ เป้าหมายคือภาษาอังกฤษง่าย ๆ ที่ใช้กับลูกได้จริงทุกวัน', mistakes:'นี่คือเหตุผลที่การเข้าใจ 44 เสียงสำคัญมาก ก่อนที่เราจะสอนลูกค่ะ', shy:'คุณแม่หลายคนรู้สึกแบบนี้ค่ะ เราจะค่อย ๆ สร้างความมั่นใจทีละขั้น', daily:'ดีมากค่ะ SmartMom จะให้กิจวัตรภาษาอังกฤษที่ใช้ได้จริงในชีวิตประจำวัน' }
  },
  { id:12, section:'44 เสียงภาษาอังกฤษ', badgeTone:'mint', paths:['mom'],
    title:'คุณเข้าใจและออกเสียง 44 เสียงภาษาอังกฤษได้มั่นใจหรือยังคะ?',
    subtitle:'เหมือนครูภาษาอังกฤษ: สระสั้น สระยาว เสียงผสม digraphs และตำแหน่งปากที่ชัดเจน',
    kind:'radio',
    options:[
      { v:'yes', e:'✅', label:'ได้ค่ะ มั่นใจ', desc:'เข้าใจและออกเสียงได้ชัดเจน' },
      { v:'some', e:'🌿', label:'รู้บางเสียง แต่ยังไม่ครบ', desc:'อยากเติมช่องว่างให้ครบ' },
      { v:'no', e:'🌱', label:'ยังไม่เคยเรียนอย่างถูกต้อง', desc:'อยากเริ่มจากพื้นฐาน' },
      { v:'not-sure', e:'❓', label:'ยังไม่แน่ใจว่า 44 เสียงคืออะไร', desc:'อยากให้ครูโบว์ช่วยไกด์' },
    ],
    coach:{ yes:'เยี่ยมมากค่ะ ครูโบว์จะช่วยต่อยอดให้กลายเป็นวิธีสอนลูกที่บ้านได้', some:'เป็นจุดเริ่มต้นที่ดีค่ะ SmartMom จะช่วยเติมเสียงที่ยังไม่มั่นใจให้ชัดเจน', no:'นี่คือสิ่งที่ SmartMom ออกแบบมาเพื่อช่วยเลยค่ะ', 'not-sure':'ไม่เป็นไรค่ะ SmartMom เริ่มตั้งแต่พื้นฐาน' }
  },
  { id:13, section:'ภาษาอังกฤษในชีวิตประจำวัน', badgeTone:'butter', paths:['mom'],
    title:'แต่ละวันคุณพูดภาษาอังกฤษกับลูกมากแค่ไหนคะ?',
    kind:'radio',
    options:[
      { v:'none', e:'😶', label:'ยังไม่ได้พูดเลย', desc:'อยากเริ่ม แต่ไม่รู้จะเริ่มยังไง' },
      { v:'few-words', e:'💬', label:'พูดได้แค่ไม่กี่คำ', desc:'เป็นวลีสั้น ๆ เท่านั้น' },
      { v:'5-10', e:'⏱️', label:'5–10 นาที', desc:'พยายามฝึกนิดหน่อย' },
      { v:'10-plus', e:'🌟', label:'มากกว่า 10 นาที', desc:'มีรูทีนอยู่แล้ว' },
      { v:'inconsistent', e:'🔁', label:'พยายามอยู่ แต่ยังไม่สม่ำเสมอ', desc:'ต้องการโครงสร้างที่ทำตามง่าย' },
    ],
    coach:{ none:'เราเริ่มแบบง่ายมาก ๆ ได้ค่ะ', 'few-words':'ไม่กี่คำก็พัฒนาเป็นรูทีนจริงได้ค่ะ', '5-10':'ดีมากค่ะ SmartMom จะช่วยให้เวลาสั้น ๆ นั้นมีประสิทธิภาพขึ้น', '10-plus':'เป็นนิสัยที่ดีมากค่ะ ครูโบว์จะช่วยปรับการออกเสียงและโครงสร้างให้ชัดขึ้น', inconsistent:'SmartMom จะให้โครงสร้างที่ทำซ้ำได้ง่ายขึ้นค่ะ' }
  },
  { id:14, section:'สิ่งที่ติดอยู่', badgeTone:'sky', paths:['mom'],
    title:'อะไรทำให้คุณยังไม่ค่อยพูดภาษาอังกฤษกับลูกคะ?',
    kind:'radio',
    options:[
      { v:'confidence', e:'💛', label:'ยังไม่มั่นใจ', desc:'อยากฝึกในพื้นที่ที่รู้สึกปลอดภัย' },
      { v:'what', e:'🧩', label:'ไม่รู้ว่าควรสอนอะไร', desc:'อยากได้แนวทางที่ชัดเจน' },
      { v:'pronounce', e:'👄', label:'ไม่รู้ว่าคำต่าง ๆ ควรออกเสียงอย่างไร', desc:'ต้องการฝึกเสียงอย่างถูกต้อง' },
      { v:'child', e:'😅', label:'ลูกไม่ค่อยฟังหรือไม่สนุก', desc:'อยากให้การฝึกสนุกขึ้น' },
      { v:'teacher', e:'🏫', label:'คาดหวังให้โรงเรียนหรือครูเป็นคนจัดการ', desc:'อยากให้คนอื่นช่วยสอนเป็นหลัก' },
    ],
    coach:{ confidence:'ความมั่นใจฝึกได้ค่ะ', what:'SmartMom จะให้เส้นทางที่ชัดเจนค่ะ', pronounce:'การออกเสียงคือพื้นฐานสำคัญค่ะ', child:'รูทีนที่สนุกทำให้การฝึกที่บ้านง่ายขึ้นค่ะ', teacher:'ครูช่วยได้ค่ะ แต่คุณแม่สร้างนิสัยประจำวันให้ลูกได้ดีที่สุด' }
  },
  { id:15, section:'ดูความเหมาะสม', badgeTone:'coral', paths:['mom'],
    title:'คุณพร้อมเรียนไปพร้อมกับลูกไหมคะ?',
    subtitle:'SmartMom เหมาะที่สุดเมื่อคุณแม่อยากพัฒนาตัวเองไปด้วยค่ะ',
    kind:'radio',
    options:[
      { v:'yes-self', e:'🔥', label:'พร้อมค่ะ อยากพัฒนาตัวเองด้วย', desc:'อยากเป็นครูภาษาอังกฤษคนแรกของลูก' },
      { v:'yes-guidance', e:'🙋‍♀️', label:'พร้อมค่ะ แต่อยากให้มีคนไกด์', desc:'อยากให้ครูโบว์บอกชัด ๆ ว่าควรทำอะไร' },
      { v:'simple', e:'🌸', label:'อาจจะค่ะ ถ้าทำได้ง่าย', desc:'ต้องการวิธีที่เหมาะกับคุณแม่ที่ยุ่ง' },
      { v:'no', e:'🏫', label:'ไม่ค่ะ อยากให้ครูเป็นคนสอนมากกว่า', desc:'ยังไม่ค่อยอยากเรียนเอง' },
    ],
    coach:{ 'yes-self':'ดีมากค่ะ นี่คือ mindset ที่เหมาะกับ SmartMom เลย', 'yes-guidance':'นี่คือสิ่งที่ครูโบว์จะช่วยค่ะ', simple:'SmartMom ออกแบบมาให้เรียบง่ายและใช้ได้จริงค่ะ', no:'ขอบคุณที่ตอบตามจริงค่ะ ครูโบว์อาจแนะนำตัวเลือกที่โฟกัสลูกโดยตรงแทน' }
  },
  { id:16, section:'เส้นทางสำหรับครู', badgeTone:'coral', paths:['teacher'],
    title:'ข้อไหนอธิบายตัวคุณได้ดีที่สุดคะ?',
    subtitle:'คำตอบนี้ช่วยให้ครูโบว์รู้ว่าควรแนะนำอบรมครู ใช้ในโรงเรียน หรือรูปแบบลิขสิทธิ์ค่ะ',
    kind:'radio',
    options:[
      { v:'teacher', e:'👩‍🏫', label:'ครูรายบุคคล', desc:'สอนห้องเรียนหรือนักเรียนของตัวเอง' },
      { v:'owner', e:'🏫', label:'เจ้าของโรงเรียน / ผู้อำนวยการ', desc:'มีอำนาจตัดสินใจให้โรงเรียนหรือศูนย์การเรียน' },
      { v:'coordinator', e:'📋', label:'หัวหน้าครู / ฝ่ายวิชาการ', desc:'ช่วยเลือกหลักสูตรหรืออบรมครู' },
      { v:'tutor', e:'🌟', label:'ติวเตอร์ / เจ้าของสถาบัน', desc:'สอนส่วนตัวหรือมีศูนย์เล็ก ๆ' },
      { v:'homeschool', e:'🏡', label:'ผู้ปกครอง/ครูโฮมสคูล', desc:'สอนเด็กที่บ้าน' },
    ],
    coach:{ teacher:'ดีค่ะ ครูโบว์ช่วยให้คุณสอนโฟนิกส์ได้มั่นใจขึ้น', owner:'ดีมากค่ะ ครูโบว์จะดูเป็นโอกาสความร่วมมือกับโรงเรียนหรือศูนย์', coordinator:'เหมาะเลยค่ะ จุดสำคัญคือการนำไปใช้จริงและการซัพพอร์ตครู', tutor:'ดีค่ะ อาจเหมาะกับความร่วมมือสำหรับศูนย์ขนาดเล็ก', homeschool:'ดีค่ะ ครูโบว์ช่วยวางโครงสร้างโฟนิกส์สำหรับสอนที่บ้านได้' }
  },
  { id:17, section:'นักเรียนของคุณ', badgeTone:'mint', paths:['teacher'],
    title:'คุณสอนนักเรียนกลุ่มไหนคะ?',
    kind:'radio',
    options:[
      { v:'kindergarten', e:'🧸', label:'อนุบาล', desc:'เด็กเล็กที่กำลังสร้างพื้นฐานเสียงและความมั่นใจ' },
      { v:'g1-g3', e:'📖', label:'ประถม ป.1–ป.3', desc:'พื้นฐานการอ่านและโฟนิกส์' },
      { v:'g4-g6', e:'📚', label:'ประถม ป.4–ป.6', desc:'เด็กโตที่ต้องการเสริมการอ่านให้แข็งแรงขึ้น' },
      { v:'mixed', e:'👧', label:'หลายช่วงอายุ', desc:'มีหลายวัยหรือหลายระดับ' },
      { v:'adults', e:'🎓', label:'ผู้ใหญ่ / อบรมครู', desc:'ครูหรือผู้ใหญ่ที่ต้องการพัฒนาโฟนิกส์' },
    ],
    coach:{ kindergarten:'อนุบาลเหมาะมากสำหรับการปูพื้นฐานโฟนิกส์', 'g1-g3':'เหมาะมากกับพื้นฐาน Jolly Phonics', 'g4-g6':'เด็กโตมักต้องการเติมช่องว่างและสร้างความมั่นใจ', mixed:'ครูโบว์ช่วยจัดระดับตามกลุ่มได้ค่ะ', adults:'เส้นทางอบรมครูอาจเหมาะที่สุดค่ะ' }
  },
  { id:18, section:'สิ่งที่ต้องการ', badgeTone:'butter', paths:['teacher'],
    title:'คุณต้องการอะไรที่สุดคะ?',
    subtitle:'เลือกได้หลายข้อที่ช่วยการสอนหรือโรงเรียนของคุณ',
    kind:'check',
    options:[
      { v:'curriculum', e:'🧭', label:'หลักสูตรโฟนิกส์', desc:'ระบบการสอนที่มีโครงสร้างชัดเจน' },
      { v:'training', e:'👩‍🏫', label:'อบรมครู', desc:'เรียนวิธีสอนโฟนิกส์อย่างถูกต้อง' },
      { v:'worksheets', e:'📝', label:'ใบงานพิมพ์ได้ / ชุดเอกสารนักเรียน', desc:'สื่อการสอนพร้อมใช้ในห้องเรียน' },
      { v:'lesson-plans', e:'📘', label:'แผนการสอน / สคริปต์การสอน', desc:'รู้ชัดเจนว่าควรพูดและทำอะไรในคลาส' },
      { v:'pronunciation', e:'🔊', label:'พัฒนาการออกเสียงของตัวเอง', desc:'สอนเสียงได้มั่นใจขึ้น' },
      { v:'licensing', e:'🤝', label:'ลิขสิทธิ์ / ความร่วมมือ', desc:'นำระบบของครูโบว์ไปใช้ในโรงเรียนหรือสถาบัน' },
    ],
    coach:{ any:'ดีค่ะ ข้อมูลนี้ช่วยให้ครูโบว์รู้ว่าควรเริ่มจากอบรม สื่อการสอน หรือรูปแบบความร่วมมือ' }
  },
  { id:19, section:'จำนวนผู้เรียน', badgeTone:'sky', paths:['teacher'],
    title:'มีนักเรียนประมาณกี่คนที่อาจใช้ระบบนี้ได้คะ?',
    kind:'radio',
    options:[
      { v:'1-5', e:'🌱', label:'1–5 คน', desc:'สอนส่วนตัวกลุ่มเล็ก' },
      { v:'6-15', e:'🌿', label:'6–15 คน', desc:'ห้องเรียนเล็กหรือกลุ่มติว' },
      { v:'16-30', e:'🌳', label:'16–30 คน', desc:'ขนาดห้องเรียนเต็ม' },
      { v:'31-100', e:'🏫', label:'31–100 คน', desc:'หลายห้องเรียนหรือใช้ทั้งศูนย์' },
      { v:'100+', e:'🚀', label:'มากกว่า 100 คน', desc:'มีโอกาสใช้ทั้งโรงเรียน' },
    ],
    coach:{ '1-5':'อาจเหมาะกับแพ็กเกจอบรมและสื่อการสอนขนาดเล็ก', '6-15':'เหมาะกับแพ็กเกจสำหรับใช้ในห้องเรียน', '16-30':'เริ่มเหมาะกับการนำไปใช้จริงในห้องเรียนค่ะ', '31-100':'มีโอกาสเป็นความร่วมมือที่ดีค่ะ', '100+':'นี่เป็นโอกาสระดับทั้งโรงเรียนค่ะ' }
  },
  { id:20, section:'ช่วงเวลาที่ต้องการเริ่ม', badgeTone:'coral', paths:['teacher'],
    title:'อยากเริ่มใช้งานเร็วแค่ไหนคะ?',
    kind:'radio',
    options:[
      { v:'immediate', e:'⚡', label:'ทันที', desc:'อยากเริ่มเร็วที่สุด' },
      { v:'this-term', e:'📅', label:'เทอมนี้', desc:'ต้องการใช้ในเทอมปัจจุบัน' },
      { v:'next-term', e:'🌤️', label:'เทอมหน้า', desc:'กำลังวางแผนล่วงหน้า' },
      { v:'research', e:'🔎', label:'กำลังศึกษาข้อมูล', desc:'กำลังรวบรวมข้อมูลก่อน' },
    ],
    coach:{ immediate:'น่าสนใจมากค่ะ ครูโบว์ควรติดต่อกลับเร็ว', 'this-term':'เป็นช่วงเวลาที่ดีสำหรับอบรมและเตรียมสื่อค่ะ', 'next-term':'เป็นช่วงวางแผนที่ดีค่ะ', research:'ไม่เป็นไรค่ะ ครูโบว์ส่งข้อมูลให้ดูก่อนได้' }
  },
];

// ---------- primary component ----------
function Quiz({ answers, setAnswers, step, setStep, path, setPath, onBackToWelcome, onDone }){
  const stepOrder = path === 'mom' ? [1,11,12,13,14,15,10]
    : path === 'teacher' ? [1,16,17,18,19,20,10]
      : STEPS.map(s => s.id);
  const visibleSteps = STEPS
    .filter(s => !s.paths || s.paths.includes(path))
    .filter(s => !s.showIf || s.showIf(answers))
    .sort((a,b) => stepOrder.indexOf(a.id) - stepOrder.indexOf(b.id));
  const stepObj = visibleSteps.find(s => s.id === step) || visibleSteps[0];
  const idx = visibleSteps.indexOf(stepObj);
  const total = visibleSteps.length;

  const childName = answers[2]?.name?.trim() || 'ลูกของคุณ';
  const interp = (s) => (s||'').replace(/\{name\}/g, childName);

  // Routing — if parent selects mom/teacher, move into that path
  const handleSelect = (val) => {
    const next = {...answers, [stepObj.id]: val};
    setAnswers(next);
    if (stepObj.id === 1) {
      if (val === 'mom') setPath('mom');
      else if (val === 'teacher') setPath('teacher');
      else setPath('parent');
    }
  };

  const handleToggle = (val) => {
    const cur = Array.isArray(answers[stepObj.id]) ? answers[stepObj.id] : [];
    const next = cur.includes(val) ? cur.filter(v=>v!==val) : [...cur, val];
    setAnswers({...answers, [stepObj.id]: next});
  };

  const goNext = () => {
    // Route non-parent paths through their qualification questions
    if (stepObj.id === 1 && answers[1]==='teacher') { setStep(16); return; }
    if (stepObj.id === 1 && answers[1]==='mom') { setStep(11); return; }
    if (stepObj.id === 10) { onDone(answers, path); return; }
    // find next visible step
    const i = visibleSteps.findIndex(s=>s.id===stepObj.id);
    const next = visibleSteps[i+1];
    if (next) setStep(next.id);
  };
  const goBack = () => {
    const i = visibleSteps.findIndex(s=>s.id===stepObj.id);
    const prev = visibleSteps[i-1];
    if (prev) setStep(prev.id);
    else onBackToWelcome?.();
  };

  const ans = answers[stepObj.id];
  const canNext = (() => {
    if (stepObj.id === 2) return answers[2]?.age && answers[2]?.grade;
    if (stepObj.kind === 'check') return Array.isArray(ans) && ans.length > 0;
    if (stepObj.id === 10) return answers[10]?.name && answers[10]?.phone && (path !== 'mom' || answers[10]?.childAge) && (path !== 'teacher' || (answers[10]?.school && answers[10]?.role));
    return !!ans;
  })();

  const isFinal = stepObj.id === 10;

  return (
    <div>
      <QuizHeader idx={idx} total={total} onBack={goBack} canBack={true} path={path}/>
      <div style={{height:14}}/>
      <div className="card quiz-card" key={stepObj.id} style={{padding:0, overflow:'hidden'}}>
        <StepHeader step={stepObj} name={childName} idx={idx} total={total}/>
        <div style={{padding:'4px 22px 20px'}}>
          {stepObj.kind === 'radio' && (
            <RadioOptions options={stepObj.options} value={ans} onChange={handleSelect}/>
          )}
          {stepObj.kind === 'check' && (
            <CheckOptions options={stepObj.options} values={Array.isArray(ans)?ans:[]} onChange={handleToggle}/>
          )}
          {stepObj.kind === 'child-form' && (
            <ChildForm value={answers[2]||{}} onChange={v=>setAnswers({...answers, 2:v})}/>
          )}
          {stepObj.kind === 'contact' && (
            <ContactForm value={answers[10]||{}} onChange={v=>setAnswers({...answers, 10:v})} path={path}/>
          )}
        </div>

        <CoachBubble step={stepObj} answer={ans} name={childName} interp={interp}/>

        <div style={{
          display:'flex', gap:10, padding:'12px 18px 18px',
          borderTop:'1px solid var(--line)', background:'oklch(0.98 0.015 78 / .6)'
        }}>
          <button className="btn btn-ghost" onClick={goBack} style={{opacity: 1}}>
            ← ย้อนกลับ
          </button>
          <div style={{flex:1}}/>
          <button
            className="btn btn-coral"
            onClick={goNext}
            disabled={!canNext}
            style={{opacity: canNext?1:0.45, pointerEvents: canNext?'auto':'none'}}>
            {isFinal ? (path==='teacher' ? 'รับข้อมูลความร่วมมือ' : path==='mom' ? 'รับคูปองส่วนลด 15%' : 'ดูคอร์สที่เหมาะกับฉัน') : 'ถัดไป'}
            <span>{isFinal ? '🎯' : '→'}</span>
          </button>
        </div>
      </div>

      <FooterLine />
    </div>
  );
}

// ---------- sub-components ----------
function QuizHeader({ idx, total, onBack, canBack, path }){
  const pct = ((idx+1)/total)*100;
  return (
    <div>
      <div className="between" style={{padding:'2px 4px 8px'}}>
        <button className="btn btn-ghost" style={{padding:'8px 10px', fontSize:13, color:'var(--ink-2)'}} onClick={onBack} disabled={!canBack}>
          ← ย้อนกลับ
        </button>
        <div className="row tiny" style={{gap:8, color:'var(--ink-2)'}}>
          <strong style={{color:'var(--ink)'}}>ขั้นตอนที่ {idx+1}</strong>
          <span className="muted">จาก {total}</span>
        </div>
      </div>
      <div style={{height:6, background:'var(--line)', borderRadius:999, overflow:'hidden'}}>
        <div style={{
          height:'100%', width:`${pct}%`,
          background:'linear-gradient(90deg, var(--coral), oklch(0.75 0.14 50))',
          borderRadius:999, transition:'width .4s cubic-bezier(.22,.61,.36,1)'
        }}/>
      </div>
      {/* dot journey */}
      <div style={{display:'flex', gap:5, marginTop:10, justifyContent:'center'}}>
        {Array.from({length: total}).map((_,i) => (
          <div key={i} style={{
            width: i===idx ? 22 : 6, height:6, borderRadius:999,
            background: i<=idx ? 'var(--coral)' : 'var(--line-2)',
            transition:'all .3s ease',
          }}/>
        ))}
      </div>
    </div>
  );
}

const TONES = {
  coral:  { bg:'var(--coral-soft)',  fg:'var(--coral-ink)' },
  mint:   { bg:'var(--mint-soft)',   fg:'var(--mint-ink)' },
  butter: { bg:'var(--butter)',      fg:'var(--butter-ink)' },
  sky:    { bg:'var(--sky-soft)',    fg:'oklch(0.38 0.08 230)' },
};
const PHOTO_TONES = { coral:'warm', mint:'mint', butter:'butter', sky:'sky' };

function StepHeader({ step, name, idx, total }){
  const tone = TONES[step.badgeTone] || TONES.coral;
  const photoTone = PHOTO_TONES[step.badgeTone] || 'warm';
  const stepPhotoLabel = PHOTO_LABELS[step.id] || 'ภาพประกอบ';

  return (
    <div>
      {/* Big scene photo banner */}
      <div style={{position:'relative'}}>
        {STEP_PHOTOS[step.id] ? (
          /\.(mp4|webm|mov)$/i.test(STEP_PHOTOS[step.id]) ? (
            <video
              src={STEP_PHOTOS[step.id]}
              autoPlay muted loop playsInline
              aria-label={stepPhotoLabel}
              style={{display:'block', margin:'0 auto', maxWidth:'100%', maxHeight:380, width:'auto', height:'auto', background:'#000'}}
            />
          ) : (
            <img
              src={STEP_PHOTOS[step.id]}
              alt={stepPhotoLabel}
              style={{display:'block', width:'100%', aspectRatio:'16/9', objectFit:'cover'}}
            />
          )
        ) : (
          <Photo
            tone={photoTone}
            ratio="16/9"
            rounded={0}
            label={stepPhotoLabel}
            hint={`ขั้นตอนที่ ${idx+1}`}
          />
        )}
        <div style={{
          position:'absolute', left:16, top:16,
          padding:'6px 10px', borderRadius:999,
          background: tone.bg, color: tone.fg,
          fontSize:10, fontWeight:800, letterSpacing:'.14em',
          boxShadow:'var(--shadow-sm)',
        }}>
          {step.section}
        </div>
      </div>
      <div style={{padding:'20px 22px 0'}}>
        <h2 className="serif" style={{
          margin:0, fontSize:'clamp(22px, 5.8vw, 26px)', lineHeight:1.15,
          fontWeight:500, letterSpacing:'-0.015em', textWrap:'balance',
        }}>
          {step.title.replace('{name}', name)}
        </h2>
        {step.subtitle && (
          <div className="muted" style={{fontSize:13.5, marginTop:8, lineHeight:1.5}}>
            {step.subtitle.replace('{name}', name)}
          </div>
        )}
        <div style={{height:18}}/>
      </div>
    </div>
  );
}

// Real photos — add paths here as images arrive. Placeholder shows for missing steps.
const STEP_PHOTOS = {
  1: 'assets/step1.jpg',
  2: 'assets/step2.jpg',
  3: 'assets/step3.jpg',
  4: 'assets/step4.jpg',
  5: 'assets/step5.jpg',  // "Advanced Phonics Level" (conditional)
  6: 'assets/step6.jpg',  // "What matters most to you?"
  7: 'assets/step7.jpg',  // "อยากเริ่มเรียนเมื่อไหร่คะ?"
  8: 'assets/step8.jpg',  // "What format fits best?"
  9: 'assets/step9.jpg',  // "How much are you comfortable investing?"
  10:'assets/step10.mp4', // "Unlock your result" — autoplay video on contact step
};

const PHOTO_LABELS = {
  1: 'ภาพ: ผู้ปกครองไทยกับลูกยิ้มพร้อมหนังสือ',
  2: 'ภาพ: มือลูกกำลังเขียนชื่อในแบบฝึกหัด',
  3: 'ภาพ: โรงเรียนหรือมุมห้องเรียนบรรยากาศอบอุ่น',
  4: 'ภาพ: แฟลชการ์ดตัวอักษรวางบนโต๊ะไม้',
  5: 'ภาพ: หนังสือ Jolly Phonics และเด็กทำท่าประกอบเสียง',
  6: 'ภาพ: เด็กอ่านออกเสียงอย่างมั่นใจ',
  7: 'ภาพ: ปฏิทินหรือแพลนเนอร์บนโต๊ะ แสงอบอุ่น',
  8: 'ภาพ: เด็กเรียนผ่าน Zoom ยิ้ม พร้อมครูโบว์บนหน้าจอ',
  9: 'ภาพ: กระปุกออมสินหรือต้นไม้เติบโต สื่อถึงการลงทุน',
  10:'ภาพ: ครูโบว์ยิ้มพร้อมรับข้อมูลของคุณ',
};

function RadioOptions({ options, value, onChange }){
  return (
    <div style={{display:'grid', gap:10}}>
      {options.map(opt => {
        const sel = value === opt.v;
        return (
          <button key={opt.v} onClick={()=>onChange(opt.v)} className="opt" aria-pressed={sel} style={{
            display:'grid', gridTemplateColumns:'52px 1fr 22px', gap:14, alignItems:'center',
            padding:'14px 16px', borderRadius:16, cursor:'pointer',
            background: sel ? 'var(--coral-soft)' : 'var(--card)',
            border: sel ? '2px solid var(--coral)' : '1.5px solid var(--line)',
            textAlign:'left', transition:'all .18s ease',
            transform: sel?'translateY(-1px)':'none',
            boxShadow: sel?'0 6px 18px oklch(0.68 0.17 35 / .2)':'none',
          }}>
            <div style={{
              width:48, height:48, borderRadius:14,
              background: sel?'#fff':'var(--bg-2)',
              display:'grid', placeItems:'center', fontSize:26,
              border: '1px solid ' + (sel?'var(--coral)':'var(--line)'),
              flexShrink:0,
            }}>{opt.e}</div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:700, fontSize:15, color:'var(--ink)'}}>{opt.label}</div>
              {opt.desc && <div className="muted" style={{fontSize:12.5, marginTop:3, lineHeight:1.4}}>{opt.desc}</div>}
            </div>
            <Radio on={sel}/>
          </button>
        );
      })}
    </div>
  );
}

function Radio({ on }){
  return (
    <div style={{
      width:22, height:22, borderRadius:99,
      border:'2px solid ' + (on?'var(--coral)':'var(--line-2)'),
      background: on?'var(--coral)':'transparent',
      display:'grid', placeItems:'center', transition:'all .18s ease',
    }}>
      {on && <div style={{width:8, height:8, borderRadius:99, background:'#fff'}}/>}
    </div>
  );
}

function CheckOptions({ options, values, onChange }){
  return (
    <div style={{display:'grid', gap:10}}>
      {options.map(opt => {
        const sel = values.includes(opt.v);
        return (
          <button key={opt.v} onClick={()=>onChange(opt.v)} className="opt" style={{
            display:'grid', gridTemplateColumns:'52px 1fr 22px', gap:14, alignItems:'center',
            padding:'14px 16px', borderRadius:16, cursor:'pointer',
            background: sel ? 'var(--mint-soft)' : 'var(--card)',
            border: sel ? '2px solid var(--mint-ink)' : '1.5px solid var(--line)',
            textAlign:'left', transition:'all .18s ease',
          }}>
            <div style={{
              width:48, height:48, borderRadius:14,
              background: sel?'#fff':'var(--bg-2)',
              display:'grid', placeItems:'center', fontSize:26,
              border: '1px solid ' + (sel?'var(--mint-ink)':'var(--line)'),
            }}>{opt.e}</div>
            <div>
              <div style={{fontWeight:700, fontSize:15}}>{opt.label}</div>
              <div className="muted" style={{fontSize:12.5, marginTop:3, lineHeight:1.4}}>{opt.desc}</div>
            </div>
            <div style={{
              width:22, height:22, borderRadius:6,
              border:'2px solid '+(sel?'var(--mint-ink)':'var(--line-2)'),
              background: sel?'var(--mint-ink)':'transparent',
              display:'grid', placeItems:'center', color:'#fff', fontSize:14, fontWeight:800,
              transition:'all .18s ease',
            }}>{sel?'✓':''}</div>
          </button>
        );
      })}
    </div>
  );
}

function ChildForm({ value, onChange }){
  const grades = ['อนุบาล 1','อนุบาล 2','อนุบาล 3','ป.1','ป.2','ป.3','ป.4','ป.5','ป.6','ม.1','ม.2','ม.3'];
  return (
    <div style={{display:'grid', gap:14}}>
      <Field label="ชื่อลูก (หรือชื่อเล่น)">
        <input
          value={value.name||''}
          onChange={e=>onChange({...value, name:e.target.value})}
          placeholder="เช่น น้องพริม"
          style={inputStyle}
        />
      </Field>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <Field label="อายุ">
          <input
            type="number" min="3" max="16"
            value={value.age||''}
            onChange={e=>onChange({...value, age:e.target.value})}
            placeholder="7"
            style={inputStyle}
          />
        </Field>
        <Field label="ระดับชั้นปัจจุบัน">
          <select
            value={value.grade||''}
            onChange={e=>onChange({...value, grade:e.target.value})}
            style={{...inputStyle, appearance:'none', background:`var(--card) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%235a5a5a' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>") no-repeat right 14px center / 12px`}}>
            <option value="" disabled>เลือก…</option>
            {grades.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function ContactForm({ value, onChange, path }){
  return (
    <div style={{display:'grid', gap:14}}>
      <TeaserCard path={path}/>

      <Field label={path==='teacher' ? 'ชื่อคุณครู' : path==='mom' ? 'ชื่อคุณแม่' : "ชื่อผู้ปกครอง"}>
        <input value={value.name||''} onChange={e=>onChange({...value, name:e.target.value})} placeholder={path==='mom' ? 'เช่น คุณบี' : 'เช่น คุณนก'} style={inputStyle}/>
      </Field>
      {path === 'mom' && (
        <Field label="อายุลูก">
          <input
            type="number" min="1" max="18"
            value={value.childAge||''}
            onChange={e=>onChange({...value, childAge:e.target.value})}
            placeholder="เช่น 5"
            style={inputStyle}
          />
        </Field>
      )}
      {path === 'teacher' && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <Field label="ชื่อโรงเรียน / ศูนย์การเรียน">
            <input value={value.school||''} onChange={e=>onChange({...value, school:e.target.value})} placeholder="เช่น ABC School" style={inputStyle}/>
          </Field>
          <Field label="ตำแหน่งของคุณ">
            <input value={value.role||''} onChange={e=>onChange({...value, role:e.target.value})} placeholder="เช่น เจ้าของ / ครูอนุบาล 2" style={inputStyle}/>
          </Field>
        </div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <Field label="เบอร์โทรศัพท์">
          <input value={value.phone||''} onChange={e=>onChange({...value, phone:e.target.value})} placeholder="08x-xxx-xxxx" style={inputStyle}/>
        </Field>
        <Field label="LINE ID">
          <input value={value.line||''} onChange={e=>onChange({...value, line:e.target.value})} placeholder="(ไม่บังคับ)" style={inputStyle}/>
        </Field>
      </div>
      <div style={{
        display:'flex', gap:10, alignItems:'flex-start',
        padding:'10px 12px', borderRadius:12, background:'var(--mint-soft)',
        fontSize:12, color:'var(--mint-ink)', lineHeight:1.5,
      }}>
        <span style={{fontSize:16, lineHeight:1}}>🔒</span>
        <div>
          <strong>ข้อมูลของคุณจะอยู่กับครูโบว์เท่านั้น</strong> ไม่แชร์ ไม่สแปม ครูโบว์จะดูคำตอบของคุณเองและติดต่อกลับภายใน 24 ชั่วโมงค่ะ
        </div>
      </div>
    </div>
  );
}

function TeaserCard({ path }){
  const title = path==='teacher' ? 'ความร่วมมือสำหรับครูและโรงเรียน Engbrain' : path==='mom' ? 'SmartMom + คูปองส่วนลด 15%' : 'Jolly Phonics Level ?';
  const desc = path==='teacher'
    ? 'อบรมครู ลิขสิทธิ์หลักสูตร สคริปต์การสอน และชุดเอกสารนักเรียน กรอกข้อมูลเพื่อดูแนวทางความร่วมมือที่เหมาะกับคุณ'
    : path==='mom'
      ? 'ฝึก 44 เสียงภาษาอังกฤษให้ชัด และเป็นครูภาษาอังกฤษคนแรกของลูก กรอกข้อมูลเพื่อรับคูปอง SMARTMOM15'
      : 'แผนเรียน 12 สัปดาห์ที่ปรับตามระดับ รูปแบบการเรียน และเป้าหมายของลูก กรอกข้อมูลเพื่อดูผลลัพธ์ค่ะ';
  return (
    <div style={{
      position:'relative', padding:'18px 18px 20px', borderRadius:18,
      background:'linear-gradient(135deg, var(--butter), var(--coral-soft))',
      overflow:'hidden', border:'1px solid oklch(0.88 0.05 60)',
    }}>
      <div className="micro" style={{color:'var(--coral-ink)', opacity:.9}}>✦ ตัวอย่างคอร์สที่เหมาะกับคุณ</div>
      <div className="serif" style={{
        fontSize:22, fontWeight:600, margin:'6px 0 4px', letterSpacing:'-0.01em',
        filter:'blur(6px)', userSelect:'none',
      }}>{title}</div>
      <div style={{filter:'blur(5px)', fontSize:13, lineHeight:1.5, color:'var(--ink-2)', userSelect:'none'}}>
        {desc}
      </div>
      <div style={{
        position:'absolute', right:14, bottom:14,
        background:'#fff', borderRadius:999, padding:'6px 12px',
        fontSize:11, fontWeight:800, letterSpacing:'.08em',
        color:'var(--coral-ink)', boxShadow:'var(--shadow-sm)',
      }}>🔒 เปิดดู</div>
    </div>
  );
}

function Field({ label, children }){
  return (
    <label style={{display:'block'}}>
      <div className="micro muted" style={{marginBottom:6, letterSpacing:'.1em', fontSize:10}}>{label}</div>
      {children}
    </label>
  );
}
const inputStyle = {
  width:'100%', font:'500 15px/1.2 "Noto Sans Thai", "Plus Jakarta Sans"',
  padding:'14px 14px', borderRadius:12,
  border:'1.5px solid var(--line)', background:'var(--card)',
  color:'var(--ink)', outline:'none',
};

function CoachBubble({ step, answer, name, interp }){
  let msg = null;
  if (step.coach) {
    if (step.kind === 'check') {
      msg = Array.isArray(answer) && answer.length ? step.coach.any : null;
    } else if (typeof answer === 'string') {
      msg = step.coach[answer];
    }
  }
  // default welcome/contact messages
  if (!msg) {
    if (step.id === 2) msg = name !== 'ลูกของคุณ' ? `ยินดีที่ได้รู้จัก ${name} ค่ะ ไปต่อกันเลยนะคะ` : 'ใส่ชื่อเล่นของลูก เพื่อให้ครูโบว์ปรับแผนให้เป็นส่วนตัวมากขึ้นค่ะ';
    else if (step.id === 10) msg = 'ใกล้เสร็จแล้วค่ะ กรอกข้อมูล แล้วครูโบว์จะส่งคอร์สที่เหมาะให้ภายใน 24 ชั่วโมง 💌';
    else return null;
  }
  const text = interp(msg);
  return (
    <div style={{
      margin:'6px 16px 2px', padding:'12px 14px',
      background:'linear-gradient(180deg, oklch(0.98 0.03 78), var(--butter))',
      border:'1px solid oklch(0.88 0.05 78)',
      borderRadius:16,
      display:'grid', gridTemplateColumns:'44px 1fr', gap:12,
      animation:'popIn .25s ease',
    }}>
      <CoachAvatar size={44} tone="warm"/>
      <div>
        <div className="tiny" style={{fontWeight:800, color:'var(--coral-ink)', letterSpacing:'.04em'}}>ครูโบว์แนะนำว่า</div>
        <div style={{fontSize:13.5, color:'var(--ink)', lineHeight:1.45, marginTop:3}}>{text}</div>
      </div>
    </div>
  );
}

function FooterLine(){
  return (
    <div className="tiny muted" style={{textAlign:'center', marginTop:24, lineHeight:1.6, padding:'0 8px'}}>
      Engbrain Kids Phonics Academy · โดยครูโบว์<br/>
      LINE: @engbrain · ☎ 096-005-6150
    </div>
  );
}

// animation keyframes injected once
if (!document.getElementById('quiz-keyframes')) {
  const s = document.createElement('style');
  s.id = 'quiz-keyframes';
  s.textContent = `
    @keyframes popIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform:none;} }
    @keyframes cardIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none;} }
    .quiz-card { animation: cardIn .32s cubic-bezier(.22,.61,.36,1); }
    .opt:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(40,30,20,.06); }
    .opt:focus-visible { outline: 2px solid var(--coral); outline-offset:2px; }
    input:focus, select:focus { border-color: var(--coral) !important; box-shadow: 0 0 0 3px oklch(0.68 0.17 35 / .18); }
    button:disabled { cursor: not-allowed; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { Quiz, STEPS, FooterLine });
