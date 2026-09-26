export interface Letter {
  id: number;
  title: string;
  message: string;
  envelopeStyle: string;
  friendName: string;
  special?: boolean;
}

export const letters: Letter[] = [
  {
    id: 1,
    title: 'Cinnamorol Mail',
    message: `Happy 18th birthday my love🤍 I’m always thankful for you, and I want you to know na whenever you have a decision to make, I’ll always be here for you no matter what. I pray na God continues to guide you sa journey mo and surrounds you with good people your family, friends, BFFs, mga ate, and especially your nanay. I’ll always be here, choosing you and supporting you every day. Enjoy your day, love! You deserve all the happiness.`,
    envelopeStyle: 'pink',
    friendName: 'Ethan',
  },
  {
    id: 2,
    title: 'Hello Kitty Mail',
    message: `Hi krixiaa, Happy Birthdayy🎉😚❤️ wish ko sayo sana maging successful ka on what you want to do, sorry be ala akong vid, i’m not feeling well kasi huhu but anywayss, mag collab tau sa crochet hihihi🤩🤩🤩`,
    envelopeStyle: 'cream',
    friendName: 'Pane',
  },
  {
    id: 3,
    title: 'Kerropi Mail',
    message: `happy 18th birthday be, just so yk im very happy and grateful na nagkakilala tayo dahil kay nissi HAHAHAHAHAHA. sana marami pa tayong games na malaro together nila pani, sean, ethan, and nessiii. may ur day filled with love, laugh and joyyy!!! and sana ur light never fade away. yun lang beh stay nigga 🥰🥰🥰🥰🥰🥰`,
    envelopeStyle: 'green',
    friendName: 'Marklie',
  },
  {
    id: 4,
    title: 'Kuromi Mail',
    message: `HAPPY BIRTHDAY KRISHAAA. sobrang swerte ko nakilala kita, couldn't imagine a world without you. U healed me in so many ways, thank you so much for existing. Sobrang ganda ng kulay ng mundo simula nung nakilala kita and i wouldn't choose another alternate universe over this. This is the best universe because i have you in it.

I love you to the stars and beyond, krisha`,
    envelopeStyle: 'strawberry',
    friendName: 'Nissi',
    special: true,
  },
  {
    id: 5,
    title: 'Pompompurin Mail',
    message: `HAPPY BIRTHDAY KRIXIA!! As the main dev behind this system, we wanted to send you a birthday greeting that’s actually unique than the padlet HAHAHAH competitive yarn. kidding aside, we just want you to feel special and happy. i wish that all your dreams come true and may you have perfect health everyday ( para di mag-alala si ethan ). ayun lang, even na kay nissi lang kita nakilala, but i cherish you as a friend already. Enjoy your day and HAPPY BIRTHDAY PO HEHE.`,
    envelopeStyle: 'pink',
    friendName: 'Sean',
  },
];
