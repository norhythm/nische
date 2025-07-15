"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Biography() {
  const [imageSource, setImageSource] = useState("profile_check.jpg");
  const [overlayBg, setOverlayBg] = useState("bg-black");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [textColor, setTextColor] = useState("text-gray-50");
  const [blendMode, setBlendMode] = useState("normal");
  return (
    <>
      {/* Biography Content */}
      <section className="container xl:max-w-screen-xl mx-auto px-4 pt-0 mb-20 md:pt-0 md:px-8">
        <h1 className="text-lg md:text-2xl tracking-wider mb-8 capitalize">
          Biography
        </h1>

        <div className="flex flex-col gap-8 mb-8 md:flex-col">
          <div className="relative overflow-hidden">
            <div className="">
              <Image
                src={`/images/${imageSource}`}
                alt="Tsukasa Kikuchi"
                width={370}
                height={555}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                className="absolute w-full h-full object-cover object-top opacity-90"
                onLoadingComplete={(image) => {
                  // Find the parent element and remove the loading indicator
                  const parent = image.parentElement?.parentElement;
                  if (parent) {
                    const loadingEl = parent.querySelector(".animate-pulse");
                    if (loadingEl) loadingEl.classList.add("hidden");
                  }
                }}
              />
              <div
                id="overlay"
                className={`absolute w-full h-full ${overlayBg}`}
                style={{
                  opacity: overlayOpacity / 100,
                  mixBlendMode: blendMode as any,
                }}
              ></div>
            </div>

            <div
              id="text"
              className={`relative pt-8 pb-8 px-4 md:pt-12 md:pb-12 md:px-12 ${textColor}`}
            >
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
                      <td className="pl-2">@tsukasa_kikuchi</td>
                    </tr>
                    <tr>
                      <td>Playlists</td>
                      <td className="pl-2">
                        <a
                          href="#"
                          className="text-gray-50 hover:text-gray-200"
                        >
                          Spotify
                        </a>
                        ,&nbsp;
                        <a
                          href="#"
                          className="text-gray-50 hover:text-gray-200"
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
      </section>

      {/* Control Panel */}
      <section className="container xl:max-w-screen-xl mx-auto px-4 pt-4 mb-8 md:px-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Editor Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Image Source Switch */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Profile Image</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <select
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="profile_2nd.jpg">profile_2nd</option>
                    <option value="profile_2nd2.jpg">profile_2nd2</option>
                    <option value="profile_check.jpg">profile_check</option>
                    <option value="profile_check2.jpg">profile_check2</option>
                    <option value="profile_check3.jpg">profile_check3</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Overlay Background Switch */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Overlay Background</label>
              <div className="flex items-center gap-3">
                <span className="text-sm">Black</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={overlayBg === "bg-white"}
                    onChange={(e) =>
                      setOverlayBg(e.target.checked ? "bg-white" : "bg-black")
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm">White</span>
              </div>
            </div>

            {/* Overlay Opacity Slider */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Overlay Opacity: {overlayOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Text Color Switch */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex items-center gap-3">
                <span className="text-sm">Light</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={textColor === "text-black"}
                    onChange={(e) =>
                      setTextColor(
                        e.target.checked ? "text-black" : "text-gray-50"
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm">Dark</span>
              </div>
            </div>

            {/* Blend Mode Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Blend Mode</label>
              <select
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
                <option value="color-dodge">Color Dodge</option>
                <option value="color-burn">Color Burn</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
                <option value="difference">Difference</option>
                <option value="exclusion">Exclusion</option>
                <option value="hue">Hue</option>
                <option value="saturation">Saturation</option>
                <option value="color">Color</option>
                <option value="luminosity">Luminosity</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
