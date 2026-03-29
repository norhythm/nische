"use client";

import Image from "next/image";
import biographyData from "@/data/biography.json";
import equipmentsData from "@/data/equipments.json";

interface EquipmentItem {
  production: string;
  name?: string;
}

interface EquipmentGroup {
  group: string;
  items?: EquipmentItem[];
}

const equipmentsGroup = (data: EquipmentGroup, i: number) => {
  return (
    <div key={i}>
      <h3 className="mb-2 font-medium uppercase">{data.group}</h3>
      <div className="leading-[1.3]">
        {data.items?.map((item: EquipmentItem, j: number) => (
          <dl key={j} className="grid grid-cols-12 gap-2 py-[3px]">
            <dt className="col-start-1 col-end-5">{item.production}</dt>
            <dd className="col-start-5 -col-end-1">{item.name}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
};

interface BiographyProps {
  bioJaHtml: string;
  bioEnHtml: string;
  equipmentNoteHtml: string;
}

export default function Biography({ bioJaHtml, bioEnHtml, equipmentNoteHtml }: BiographyProps) {
  return (
    <>
      {/* Biography Content */}
      <section className="w-full xl:max-w-screen-xl mx-auto px-4 md:px-[8%] xl:px-[102px] pt-0 mb-20 md:pt-0 md:px-8">
        <h1 className="text-lg md:text-2xl tracking-wider mb-4 md:mb-8 capitalize">
          Biography
        </h1>

        <div className="flex flex-col gap-8 mb-12 md:flex-col md:mb-16">
          <div className="relative overflow-hidden">
            <div className="">
              <Image
                src={biographyData.profile_image}
                alt={biographyData.name_ja}
                width={370}
                height={555}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                className="absolute w-full h-full object-cover object-top transition-[filter] duration-200 blur-[2.7px]"
              />
              <div className="absolute w-full h-full opacity-40 md:opacity-50 mix-blend-multiply bg-black md:bg-natural"></div>
            </div>

            <div className="relative pt-8 pb-8 px-4 md:pt-12 md:pb-10 md:px-12 text-gray-50 tracking-wide">
              <h2 className="text-lg md:text-2xl mb-2 mincho tracking-wider">
                {biographyData.name_ja}
              </h2>
              <p className="text-sm md:text-base mb-4">{biographyData.title}</p>

              <div className="flex flex-col md:flex-row md:gap-12 mb-8">
                <div
                  className="mb-4 leading-[1.5] md:leading-[1.8] flex-1 text-[13px] md:text-[15px] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: bioJaHtml }}
                />

                <div
                  className="mb-4 md:leading-[1.675] flex-1 text-sm md:text-base [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: bioEnHtml }}
                />
              </div>

              <div className="text-[13px] md:text-[15px] leading-[1.5]">
                <table>
                  <tbody>
                    {biographyData.links.map((link, i) => (
                      <tr key={i}>
                        <td>{link.label}</td>
                        <td className="pl-2">
                          {"url" in link && link.url ? (
                            <a
                              href={link.url}
                              className="decoration-underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.text}
                            </a>
                          ) : (
                            "lists" in link &&
                            link.lists?.map((item, j) => (
                              <span key={j}>
                                {j > 0 && <>,&nbsp;</>}
                                <a
                                  href={item.url}
                                  className="decoration-underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.text}
                                </a>
                              </span>
                            ))
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="mb-16">
          <h2 className="text-lg md:text-2xl tracking-wider mb-4 md:mb-8">
            Equipments
          </h2>
          <div>
            <div className="grid md:grid-cols-2 gap-8 relative tracking-wide text-sm md:text-base">
              <div className="flex flex-col gap-8">
                {equipmentsData.groups
                  .slice(0, 3)
                  .map((data, i) => equipmentsGroup(data, i))}
              </div>
              <div className="flex flex-col gap-8">
                {equipmentsData.groups
                  .slice(3)
                  .map((data, i) => equipmentsGroup(data, i))}
              </div>
            </div>
          </div>

          {equipmentNoteHtml && (
            <div
              className="text-sm mt-4 md:mt-8 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: equipmentNoteHtml }}
            />
          )}
        </div>
      </section>
    </>
  );
}
