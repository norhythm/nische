"use client";

import Image from "next/image";
import Link from "next/link";

export default function Biography() {
  return (
    <>
      {/* Biography Content */}
      <section className="container md:max-w-7xl mx-auto px-4 pt-0 mb-20 md:pt-0 md:px-8">
        <h1 className="text-lg md:text-2xl tracking-wider mb-4 md:mb-8 capitalize">
          Biography
        </h1>

        <div className="flex flex-col gap-8 mb-12 md:flex-col md:mb-16">
          <div className="relative">
            <div className="">
              <Image
                src="/images/profile_check3.jpg"
                alt="Tsukasa Kikuchi"
                width={370}
                height={555}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                className="absolute w-full h-full object-cover object-top"
              />
              <div
                className="absolute w-full h-full opacity-50 mix-blend-multiply"
                style={{ backgroundColor: "#7b7c4c" }}
              ></div>
            </div>

            <div className="relative pt-8 pb-8 px-4 md:pt-12 md:pb-12 md:px-12 text-gray-50 tracking-wide">
              <h2 className="text-lg md:text-2xl mb-2 mincho tracking-wider">
                菊池 司
              </h2>
              <p className="text-sm md:text-base mb-4">
                Recording / Mixing / Mastering Engineer
              </p>

              <div className="flex flex-col md:flex-row md:gap-12 mb-8 text-sm md:text-base">
                <p className="mb-4 leading-loose flex-1">
                  1985年生まれ。東京出身。自主制作の過程で音響と機材に深い興味を持ち、エンジニアリングへ傾倒。ビート・エレクトロニックミュージックを軸にしながらも様々なルーツを持ち、持ち前の好奇心と繊細さから、繊細で精緻な表現から攻撃的で混沌としたサウンドまで、あらゆるスタイルに対応。制作チーム「Arte
                  Refact」に所属しながら、常なる活動の幅を広げている。
                </p>

                <p className="mb-4 leading-loose flex-1">
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

              <div className="text-sm md:text-base">
                <table>
                  <tbody>
                    <tr>
                      <td>X(Twitter)</td>
                      <td className="pl-2">
                        <a href="https://x.com/tsukasa_kikuchi" target="_blank">
                          @tsukasa_kikuchi
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Playlists</td>
                      <td className="pl-2">
                        <a href="#" className="">
                          Spotify
                        </a>
                        ,&nbsp;
                        <a href="#" className="">
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

          {/* <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-6 gap-0 md:gap-8"> */}
          <div className="">
            <div className="relative">
              {/* <div className="">
                <Image
                  src="/images/studio.jpg"
                  alt="Tsukasa Kikuchi"
                  width={370}
                  height={555}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  className="absolute w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute w-full h-full bg-black opacity-30"></div>
              </div> */}

              <div className="grid md:grid-cols-3 gap-8 relative tracking-wide text-sm md:text-base">
                <div>
                  <h3 className="mb-2 font-medium uppercase">Monitor</h3>

                  <ul className="leading-normal">
                    <li>Amphion Two18+BaseTwo25</li>
                    <li>Auratone 5C</li>
                    <li>Victor EX-A1</li>
                    <li>Audeze MM-500</li>
                    <li>OLLOAudio X1</li>
                    <li>TAOSTUDIO T3-01</li>
                    <li>SPL PhonitorX</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-medium uppercase">Converter</h3>

                  <ul className="leading-normal">
                    <li>PrismSound DREAM ADA-128</li>
                    <li>Lavry Engineering AD-24-2016avIIr</li>
                    <li>AVID MTRX</li>
                    <li>Lynx aurora(8)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium uppercase">
                    Compressor/Dynamics
                  </h3>

                  <ul className="leading-normal">
                    <li>KmfAudio SOLO</li>
                    <li>VertigoSound VSC-3CompressorVCA</li>
                    <li>rockruepel COMP.TWO</li>
                    <li>Bettermaker MasteringLimiter2.0</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium uppercase">
                    Equalizer/Enhancer
                  </h3>

                  <ul className="leading-normal">
                    <li>KmfAudio EX5A(gain/filter)</li>
                    <li>VertigoSound VSE-2Gyrator EQ</li>
                    <li>Heritage Audio 73JR</li>
                    <li>VSM-2microSATELLITEM2FULL Version</li>
                    <li>elysia Museq</li>
                    <li>BlackBoxAnalogDesign HG-2</li>
                    <li>CranbourneAudio HE2</li>
                    <li>Sonidform StarTEQ</li>
                    <li>DanAgeAudioworks V2EQ</li>
                    <li>CustomAudioGermany HDE-250A</li>
                    <li>HandyAmps Michelangelo</li>
                    <li>D.A.V Electronics BroadhurstGardensNo.3MKV</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium uppercase">Plugins</h3>

                  <ul className="leading-normal">
                    <li>DMG</li>
                    <li>MAAT</li>
                    <li>Leapwing</li>
                    <li>iZotope</li>
                  </ul>
                </div>
                <div>
                  <ul className="leading-normal">
                    <li>and more...</li>
                  </ul>
                </div>
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
