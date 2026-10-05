import React from "react";

export const HeroFanti: React.FC<{small?:boolean}> = ({small=false}) => (
  <svg viewBox="0 0 300 330" className={small ? "w-[190px] h-[210px]" : "w-[260px] h-[290px]"} aria-label="Fanti">
    <defs>
      <linearGradient id="fBody" x1="0" x2="1"><stop offset="0" stopColor="#9ca3af"/><stop offset="1" stopColor="#6b7280"/></linearGradient>
      <linearGradient id="fShirt" x1="0" x2="1"><stop offset="0" stopColor="#facc15"/><stop offset="1" stopColor="#f59e0b"/></linearGradient>
    </defs>
    <ellipse cx="150" cy="310" rx="92" ry="13" fill="#000" opacity=".15"/>
    <ellipse cx="72" cy="145" rx="53" ry="75" fill="#7d8590" stroke="#273449" strokeWidth="6"/>
    <ellipse cx="228" cy="145" rx="53" ry="75" fill="#7d8590" stroke="#273449" strokeWidth="6"/>
    <ellipse cx="73" cy="150" rx="34" ry="50" fill="#e7a6a8" opacity=".75"/>
    <ellipse cx="227" cy="150" rx="34" ry="50" fill="#e7a6a8" opacity=".75"/>
    <ellipse cx="150" cy="162" rx="92" ry="105" fill="url(#fBody)" stroke="#273449" strokeWidth="6"/>
    <path d="M82 70 Q150 42 218 70 L211 92 Q150 76 89 94Z" fill="#facc15" stroke="#273449" strokeWidth="5"/>
    <path d="M101 70 Q150 42 199 70" fill="none" stroke="#f59e0b" strokeWidth="10"/>
    <text x="150" y="73" textAnchor="middle" fontSize="30" fontWeight="900" fill="#2563eb">B</text>
    <ellipse cx="119" cy="142" rx="25" ry="30" fill="#fff"/>
    <ellipse cx="181" cy="142" rx="25" ry="30" fill="#fff"/>
    <circle cx="121" cy="146" r="13" fill="#1f2937"/><circle cx="179" cy="146" r="13" fill="#1f2937"/>
    <circle cx="125" cy="141" r="4" fill="#fff"/><circle cx="183" cy="141" r="4" fill="#fff"/>
    <ellipse cx="98" cy="178" rx="15" ry="8" fill="#fb7185" opacity=".55"/><ellipse cx="202" cy="178" rx="15" ry="8" fill="#fb7185" opacity=".55"/>
    <path d="M150 153 C150 198 118 209 105 190 C96 176 105 164 122 166" fill="none" stroke="#7d8590" strokeWidth="25" strokeLinecap="round"/>
    <path d="M150 153 C150 198 118 209 105 190" fill="none" stroke="#273449" strokeWidth="4" strokeLinecap="round"/>
    <path d="M91 225 Q150 197 209 225 L224 297 Q150 322 76 297Z" fill="url(#fShirt)" stroke="#273449" strokeWidth="6"/>
    <circle cx="150" cy="246" r="29" fill="#0ea5e9" stroke="#fff" strokeWidth="5"/>
    <path d="M134 239 Q150 228 166 239 L158 259 L142 259Z" fill="#22c55e"/>
    <path d="M132 270 Q150 257 168 270" fill="none" stroke="#2563eb" strokeWidth="5"/>
    <path d="M207 214 Q244 178 263 143" fill="none" stroke="#7d8590" strokeWidth="28" strokeLinecap="round"/>
    <path d="M258 144 Q274 125 286 143 Q274 158 259 157" fill="#7d8590" stroke="#273449" strokeWidth="5"/>
    <circle cx="274" cy="135" r="5" fill="#fff"/>
  </svg>
);

export const GlobeIllustration: React.FC = () => (
  <div className="relative w-[310px] h-[310px] sm:w-[390px] sm:h-[390px]">
    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_25%,#b9f4ff_0,#2bc1f0_28%,#1769c0_68%,#073b8f_100%)] border-[9px] border-white/90 shadow-[0_28px_70px_rgba(8,61,120,.42)] overflow-hidden">
      <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent 0 48px,rgba(255,255,255,.65) 49px,transparent 50px),repeating-linear-gradient(0deg,transparent 0 48px,rgba(255,255,255,.65) 49px,transparent 50px)]"/>
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <path d="M65 105 Q95 70 145 83 L175 113 154 145 128 142 110 171 76 155 57 126Z" fill="#35b96b" stroke="#1d8a50" strokeWidth="3"/>
        <path d="M182 72 Q230 48 272 75 L303 105 281 126 245 112 225 139 192 123Z" fill="#45c46f" stroke="#1d8a50" strokeWidth="3"/>
        <path d="M200 153 L241 142 262 174 247 211 265 249 241 302 210 275 216 238 194 204Z" fill="#42bf6b" stroke="#1d8a50" strokeWidth="3"/>
        <path d="M292 145 L336 163 348 202 327 228 300 212 282 177Z" fill="#55c978" stroke="#1d8a50" strokeWidth="3"/>
        <path d="M117 190 L148 204 160 242 143 274 124 252 130 221 108 209Z" fill="#4bc372"/>
        <path d="M78 265 Q112 282 149 275 L177 296 160 326 113 321 85 300Z" fill="#42b96a"/>
        <circle cx="136" cy="111" r="7" fill="#facc15"/><circle cx="245" cy="96" r="7" fill="#facc15"/><circle cx="230" cy="178" r="7" fill="#facc15"/>
      </svg>
    </div>
    <span className="absolute -top-9 left-10 text-5xl">🎈</span>
    <span className="absolute -top-2 right-3 text-5xl">🗼</span>
    <span className="absolute top-24 -right-8 text-5xl">🎈</span>
    <span className="absolute bottom-9 -left-8 text-5xl">🐘</span>
    <span className="absolute bottom-0 right-16 text-5xl">🦁</span>
    <span className="absolute top-4 left-1/2 text-3xl">✈️</span>
  </div>
);

export const WorldMapIllustration: React.FC = () => (
  <svg viewBox="0 0 1000 560" className="absolute inset-0 w-full h-full">
    <defs>
      <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9be7ff"/><stop offset=".55" stopColor="#24b6e7"/><stop offset="1" stopColor="#1197cf"/></linearGradient>
      <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5fd47a"/><stop offset="1" stopColor="#1c9d59"/></linearGradient>
    </defs>
    <rect width="1000" height="560" rx="34" fill="url(#sea)"/>
    <g opacity=".22" stroke="#fff" strokeWidth="2">
      <path d="M50 90H950M40 190H960M35 290H965M50 390H950M70 490H930"/>
      <path d="M160 30V520M300 20V530M440 15V540M580 15V540M720 20V530M860 30V520"/>
    </g>
    <path d="M82 137 Q125 83 196 95 L244 124 267 172 238 204 196 190 171 220 127 204 101 174Z" fill="url(#land)" stroke="#15803d" strokeWidth="5"/>
    <path d="M216 238 L264 228 300 257 291 306 267 338 286 392 264 456 229 430 233 377 205 335 217 286Z" fill="url(#land)" stroke="#15803d" strokeWidth="5"/>
    <path d="M340 105 Q396 75 454 98 L492 122 477 153 431 144 406 172 360 160 326 137Z" fill="url(#land)" stroke="#15803d" strokeWidth="5"/>
    <path d="M398 174 L443 159 485 188 504 242 484 292 493 354 466 413 425 392 407 338 420 283 395 239Z" fill="#e2a93b" stroke="#c27c16" strokeWidth="5"/>
    <path d="M520 122 L581 98 644 113 700 143 734 171 710 207 661 198 627 216 583 190 548 202 518 170Z" fill="url(#land)" stroke="#15803d" strokeWidth="5"/>
    <path d="M550 205 L603 194 650 221 683 268 669 310 637 299 610 333 575 302 548 257Z" fill="#58c96d" stroke="#15803d" strokeWidth="5"/>
    <path d="M722 281 L774 274 819 301 842 338 816 372 773 360 747 382 718 348Z" fill="#58c96d" stroke="#15803d" strokeWidth="5"/>
    <path d="M757 411 L816 397 864 421 889 455 861 481 813 474 782 452Z" fill="#59c96d" stroke="#15803d" strokeWidth="5"/>
    <path d="M330 470 Q500 435 695 470 Q520 530 330 470Z" fill="#dcefff" stroke="#a7d8f7" strokeWidth="4"/>
  </svg>
);