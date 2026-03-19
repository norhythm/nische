import markdownToHtml from "@/lib/markdownToHtml";
import biographyData from "@/data/biography.json";
import Biography from "./biography";

export default async function BiographyPage() {
  const [bioJaHtml, bioEnHtml, equipmentNoteHtml] = await Promise.all([
    markdownToHtml(biographyData.bio_ja || ""),
    markdownToHtml(biographyData.bio_en || ""),
    markdownToHtml(biographyData.equipment_note || ""),
  ]);

  return (
    <Biography
      bioJaHtml={bioJaHtml}
      bioEnHtml={bioEnHtml}
      equipmentNoteHtml={equipmentNoteHtml}
    />
  );
}
