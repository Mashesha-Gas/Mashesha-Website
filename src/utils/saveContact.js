import { WHATSAPP_NUMBER } from "./whatsapp";

// WhatsApp only delivers broadcast messages to people who have the sender
// saved as a contact — this is what the post-signup "Save our number"
// prompt links to. Opening a .vcf triggers the phone's native
// add-contact sheet on iOS/Android instead of downloading a file.
const VCARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "FN:Mashesha Gas",
  "ORG:Mashesha Gas",
  `TEL;TYPE=CELL:+${WHATSAPP_NUMBER}`,
  "END:VCARD",
].join("\n");

export const MASHESHA_VCARD_URL = `data:text/vcard;charset=utf-8,${encodeURIComponent(VCARD)}`;
