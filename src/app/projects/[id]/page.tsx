'use client';

import logoSrc from "@assets/header-logo.svg";
import accountSrc from "@assets/account.svg";
import globeSrc from "@assets/globe.svg";
import plusSrc from "@assets/plus.svg";
import deleteSrc from "@assets/delete.svg";
import closeSrc from "@assets/close.svg";
import editSrc from "@assets/edit.svg";
import backSrc from "@assets/back.svg";
import copySrc from "@assets/copy.svg";
import searchSrc from "@assets/search.svg";
import lightningSrc from "@assets/lightning.svg";
import editFreenSrc from "@assets/edit_green.svg";
import { IUser } from "@pages/signin/page";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IProjecDetail } from "../page";
import classNames from "classnames";
import { useRouter } from "next/navigation";

export default function ProjectList() {
  const router =useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<IProjecDetail>({
    name: "",
    overview: "",
    createdDate: "",
    createdBy: "",
    files: [],
    faqs: []
  })

  useEffect(() => {
    const localstorageUser = localStorage.getItem("user");
    if (localstorageUser) {
      setUser(JSON.parse(localstorageUser));
    }
    setProjectDetail({
      name: "Project A",
      overview: "some overview",
      createdDate: "2023/09/10",
      createdBy: "Andrew Tanaka",
      files: [
        {
          name: "2023Sept_ProjectBrief_ProjectA.pdf",
          content: ""
        }
      ],
      faqs: [
        {
          q: " Which framework is used?",
          a: "NextJS 13",
        },
        {
          q: " Which framework is used?",
          a: "NextJS 13",
        },
      ]
    })
  },[])
  
  return (
    <div>
      <div className="py-7 px-16 flex justify-between bg-gradient-to-r from-[#1E4CC6] to-[#5282FF]">
        <Image src={logoSrc} alt="logo" priority/>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-white">
            <Image src={accountSrc} alt="account" priority/>
            <span>Welcome back, {user?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Image src={globeSrc} alt="globe" priority/>
            <span>English</span>
          </div>
        </div>
      </div>
      <div className="max-h-[calc(100vh-104px)] overflow-auto flex justify-center gap-20 py-10">
        <div className="w-full max-w-[1074px] h-fit">
          <div className="px-8">
            <div className="flex gap-2 mb-10 cursor-pointer w-fit" onClick={() => router.push("/projects")}>
              <Image src={backSrc} alt="account" priority/>
              <span className="text-main text-sm underline">Back to List of Projects</span>
            </div>
            <div className="flex justify-between items-center mb-14">
              <div className="flex gap-8 items-center">
                <div className="text-main text-5xl font-bold">{projectDetail.name}</div>
                <button className="h-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4">
                  <Image src={copySrc} alt="plus" priority/>
                  <span>Copy Link</span>
                </button>
                <button className="h-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4" onClick={() => setOpenDialog(true)}>
                  <Image src={editSrc} alt="plus" priority width={16} height={16}/>
                  <span>Edit Project</span>
                </button>
              </div>
              <div className="text-ink-500 text-sm">
                <div>Date Created  : {projectDetail.createdDate}</div>
                <div>Created By      : {projectDetail.createdBy}</div>
              </div>
            </div>
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Project Overview</div>
              <div className="text-sm">{projectDetail.overview}</div>
            </div>
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Uploaded Files</div>
              <div className="flex flex-col gap-4">
                {
                  projectDetail.files.map((file, index) => (                
                    <div className="text-sm" key={index}>{file.name}</div>
                  ))
                }
              </div>
            </div>
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Looking for Something?</div>
              <div className="w-full max-w-[560px] grid grid-cols-[auto_32px] gap-2 border border-gray rounded-lg py-4 px-6">
                <input className="focus:outline-none" placeholder="Search here"/>
                <Image src={searchSrc} alt="search" priority className="cursor-pointer"/>
              </div>
            </div>
          </div>
          <div className="min-w-full h-[1px] bg-green my-14"></div>
          <div className="px-8">
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Project Questions</div>
              {
                projectDetail.faqs.map((faq, index) => (
                  <div className="flex flex-col w-fit" key={index}>
                    <div className="py-2 font-semibold flex cursor-pointer" onClick={() => setOpenFaq(index !== openFaq ? index : null)}>
                      <span>Q: {faq.q}</span>
                      <div className={classNames("ml-4", {"bg-secondary_light": openFaq === index})}><Image src={backSrc} alt="account" priority className={classNames("rotate-90", {"-rotate-90": openFaq === index})}/></div>
                    </div>
                    <div className={classNames({"max-h-0 overflow-hidden": openFaq!== index}, {"max-h-fit py-2": openFaq === index})}>A: {faq.a}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      {
        openDialog &&
        <div className="w-screen h-screen overflow-y-auto absolute top-0 left-0 bg-modal flex justify-center py-[207px]">
          <div className="w-full max-w-[896px] h-fit bg-white rounded-lg p-8">
            <div className="flex justify-end mb-2"><Image src={closeSrc} alt="close" priority className="cursor-pointer" onClick={() => setOpenDialog(false)}/></div>
            <div className="text-main text-2xl font-semibold mb-8">Add Project</div>
            <div className="min-w-full h-[1px] bg-green mb-10"></div>
            <div className="px-3">
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Name</div>
                <input className="w-full border border-gray rounded-lg py-4 px-6" placeholder="Project ABC"/>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Overview</div>
                <textarea className="w-full border border-gray rounded-lg py-4 px-6" placeholder="Project overview texts here" rows={2}/>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Files</div>
                <div className="flex flex-col gap-6">
                  {
                    projectDetail.files.map((file, index) => (
                      <div key={index} className="grid grid-cols-2 text-ink-500">
                        <span>{file.name}</span>
                        <div className="flex">
                          <Image src={deleteSrc} alt="delete" priority className="cursor-pointer"/>
                          <span className="underline text-ink">Delete</span>
                        </div>
                      </div>
                    ))
                  }
                  <div className="flex flex-col gap-2">
                    <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4" onClick={() => setOpenDialog(true)}>
                      <Image src={plusSrc} alt="plus" priority/>
                      <span>Add File</span>
                    </button>
                    <div className="px-6 text-ink text-sm">File formats: .doc, .pdf, .xls</div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Suggested FAQs</div>
                <div className="flex flex-col gap-6 mb-6">
                  {
                    projectDetail.faqs.map((faq, index) => (
                      <div className="pb-6 border-b border-gray grid grid-cols-3 place-items-start" key={index}>
                        <div className="col-span-2 flex flex-col gap-4">
                          <div className="text-ink-500 font-semibold">Q: {faq.q}</div>
                          <div className="text-ink-500">A: {faq.a}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4">
                            <Image src={editSrc} alt="edit" priority/>
                            <span>Edit</span>
                          </button>
                          <div className="flex items-center gap-2 py-2 px-4">
                            <Image src={deleteSrc} alt="delete" priority className="cursor-pointer"/>
                            <span className="underline text-ink">Delete</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className="flex gap-6">
                  <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg text-green py-2 px-4">
                    <Image src={editFreenSrc} alt="edit green" priority/>
                    <span>Write New FAQs</span>
                  </button>
                  <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg bg-green text-white py-2 px-4">
                    <Image src={lightningSrc} alt="lightning" priority/>
                    <span>Generate More FAQs</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="min-w-full h-[1px] bg-green my-10"></div>
            <div className="flex gap-6 justify-center">
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full text-secondary py-2 px-4" onClick={() => setOpenDialog(false)}>
                Cancel
              </button>
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full bg-secondary text-white py-2 px-4">
                Confirm and Apply Edit
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
