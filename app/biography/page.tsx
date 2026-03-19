"use client";

import Image from "next/image";
import equipmentsData from "@/data/equipments.json";

const equipmentsGroup = (data: any, i: number) => {
  return (
    <div key={i}>
      <h3 className="mb-2 font-medium uppercase">{data.group}</h3>
      <div className="leading-[1.3]">
        {data.items?.map((item: any, j: number) => (
          <dl key={j} className="grid grid-cols-12 gap-2 py-[3px]">
            <dt className="col-start-1 col-end-5">{item.production}</dt>
            <dd className="col-start-5 -col-end-1">{item.name}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
};

export default function Biography() {
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
                src="/images/profile.jpg"
                alt="Tsukasa Kikuchi"
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
                菊池 司
              </h2>
              <p className="text-sm md:text-base mb-4">
                Recording / Mixing / Mastering Engineer
              </p>

              <div className="flex flex-col md:flex-row md:gap-12 mb-8">
                <p className="mb-4 leading-[1.5] md:leading-[1.8] flex-1 text-[13px] md:text-[15px]">
                  1985年生まれ。東京出身。自主制作の過程で音響と機材に深い興味を持ち、エンジニアリングへ傾倒。ビート・エレクトロニックミュージックを軸にしながらも様々なルーツを持ち、持ち前の好奇心と繊細さから、繊細で精緻な表現から攻撃的で混沌としたサウンドまで、あらゆるスタイルに対応。制作チーム「Arte
                  Refact」に所属しながら、常なる活動の幅を広げている。
                </p>

                <p className="mb-4 md:leading-[1.675] flex-1 text-sm md:text-base">
                  Born in 1985, Tokyo. Through self-produced projects, developed
                  a deep interest in acoustics and equipment, which led to a
                  passion for engineering. While centered on beat and electronic
                  music, draws from a wide variety of influences. Driven by
                  innate curiosity, capable of handling everything from
                  delicate, intricate expressions to aggressive and chaotic
                  sounds. A member of the production team Arte Refact, and
                  continues to expand activities into new arenas.
                </p>
              </div>

              <div className="text-[13px] md:text-[15px] leading-[1.5]">
                <table>
                  <tbody>
                    <tr>
                      <td>X(Twitter)</td>
                      <td className="pl-2">
                        <a
                          href="https://x.com/tsukasa_kikuchi"
                          className="decoration-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @tsukasa_kikuchi
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Playlists</td>
                      <td className="pl-2">
                        <a
                          href="https://open.spotify.com/playlist/4U1dQMh92G4ELhc4aMHI7N?si=7d94615962db4ef2"
                          className="decoration-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Spotify
                        </a>
                        ,&nbsp;
                        <a
                          href="https://music.apple.com/jp/playlist/%E8%8F%8A%E6%B1%A0%E5%8F%B8-tsukasa-kikuchi-arte-refact/pl.u-e98lGapca4vgAmd"
                          className="decoration-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Apple Music
                        </a>
                      </td>
                    </tr>
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
                {equipmentsData
                  .slice(0, 3)
                  .map((data, i) => equipmentsGroup(data, i))}
              </div>
              <div className="flex flex-col gap-8">
                {equipmentsData
                  .slice(3)
                  .map((data, i) => equipmentsGroup(data, i))}
              </div>
            </div>
          </div>

          <p className="text-sm mt-4 md:mt-8">
            *Please refer to{" "}
            <a
              className="decoration-underline"
              href="https://www.arte-refact.com/studio/"
              target="_blank"
            >
              the studio materials of Arte Refact
            </a>{" "}
            for information on the recording equipment.
          </p>
        </div>
      </section>
    </>
  );
}
