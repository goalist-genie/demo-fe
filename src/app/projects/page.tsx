'use client';

import logoSrc from "@assets/header-logo.svg";
import accountSrc from "@assets/account.svg";
import globeSrc from "@assets/globe.svg";
import plusSrc from "@assets/plus.svg";
import deleteSrc from "@assets/delete.svg";
import closeSrc from "@assets/close.svg";
import { IUser } from "@pages/signin/page";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL, DATE_FORMAT } from "lib/constants";
import axios from "axios";
import { IProjectDataResponseItem, IProjectRequestBody } from "lib/dtos";
import moment from "moment";

export interface IFile {
  name: string;
  content: File;
}

export interface IFaq {
  q: string;
  a: string;
}

export default function ProjectList() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [projects, setProjects] = useState<IProjectDataResponseItem[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [projectRequest, setProjectRequest] = useState<IProjectRequestBody>({
    name: "",
    overview: "",
    created_by: "",
    files: [],
    generate_faq: true,
  })
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);
  const inputRef = useRef(null);
  
  const getProjects = () => {
    const url = BASE_URL + "/projects";
    axios.get(url)
      .then(res => setProjects(res.data))
      .catch(() => {})
  }

  const deleteFile = (pos: number) => {
    setUploadedFiles([...uploadedFiles].filter((item, index) => index !== pos));
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).value = "";
    }
  }

  const deleteProject = (id: number) => {
    const url = BASE_URL + "/projects/" + id;
    axios.delete(url)
      .then(() => getProjects())
      .catch(() => {})
  }

  const handleUploadFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const uploadedFiles: IFile[] = [];
      Array.from(files).forEach(item => {
        uploadedFiles.push({name: item.name, content: item})
      })
      setUploadedFiles(uploadedFiles);
    }
  }

  const createNewProject = () => {
    const url = BASE_URL + "/projects";
    const files = uploadedFiles.map(file => file.content);
    const data = new FormData();
    data.append("name", projectRequest.name);
    data.append("overview", projectRequest.overview);
    data.append("created_by", user ? user.name : "");
    data.append("indexing", "false");
    files.forEach(file => {
      data.append("files", file);
    })
    axios.post(url, data, {headers: { "Content-Type": "multipart/form-data" }})
      .then(() => getProjects())
      .catch(() => {})
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProjectRequest({
      name: "",
      overview: "",
      created_by: "",
      files: [],
      generate_faq: true,
    })
  }

  useEffect(() => {
    const localstorageUser = localStorage.getItem("user");
    if (localstorageUser) {
      setUser(JSON.parse(localstorageUser));
    }
    getProjects();
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
        <div className="w-full max-w-[1074px]">
          <div className="text-main text-5xl font-bold mb-12">List of Projects</div>
          <button className="flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4 mb-4" onClick={() => setOpenDialog(true)}>
            <Image src={plusSrc} alt="plus" priority/>
            <span>Add Project</span>
          </button>
          <div className="grid grid-cols-12 rounded-t-lg bg-main text-white border border-gray">
            <div className="col-span-5 py-3 px-6 border-r border-gray">Project Name</div>
            <div className="col-span-3 py-3 px-6 border-r border-gray">Date Created</div>
            <div className="col-span-3 py-3 px-6 border-r border-gray">Created By</div>
            <div className="py-3 px-6 flex justify-center"></div>
          </div>
          {
            projects.map((proj, index) => (
              <div key={index} className="grid grid-cols-12 border border-gray border-t-0 hover:bg-light_green hover:text-dark_green" >
                <div className="col-span-5 py-3 px-6 border-r border-gray"><span onClick={() => router.push(`/projects/${proj.id}`)} className="cursor-pointer">{proj.name}</span></div>
                <div className="col-span-3 py-3 px-6 border-r border-gray">{moment(proj.created_at).format(DATE_FORMAT)}</div>
                <div className="col-span-3 py-3 px-6 border-r border-gray">{proj.created_by}</div>
                <div className="py-3 px-6 flex justify-center"><Image src={deleteSrc} alt="delete" priority className="cursor-pointer" onClick={() => deleteProject(proj.id)} /></div>
              </div>
            ))
          }
        </div>
      </div>
      {
        openDialog &&
        <div className="w-screen h-screen overflow-y-auto absolute top-0 left-0 bg-modal flex justify-center py-[100px]">
          <div className="w-full max-w-[896px] h-fit bg-white rounded-lg p-8">
            <div className="flex justify-end mb-2"><Image src={closeSrc} alt="close" priority className="cursor-pointer" onClick={() => handleCloseDialog()}/></div>
            <div className="text-main text-2xl font-semibold mb-8">Add Project</div>
            <div className="min-w-full h-[1px] bg-green mb-10"></div>
            <div className="px-3">
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Name</div>
                <input className="w-full border border-gray rounded-lg py-4 px-6" placeholder="Project ABC" value={projectRequest.name} onChange={(e) => setProjectRequest({...projectRequest, name: e.target.value})}/>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Overview</div>
                <textarea className="w-full border border-gray rounded-lg py-4 px-6" placeholder="Project overview texts here" rows={2} value={projectRequest.overview} onChange={(e) => setProjectRequest({...projectRequest, overview: e.target.value})}/>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Project Files</div>
                <div className="flex flex-col gap-6">
                  {
                    uploadedFiles.map((file, index) => (
                      <div key={index} className="grid grid-cols-2 text-ink-500">
                        <span>{file.name}</span>
                        <div className="flex cursor-pointer" onClick={() => deleteFile(index)}>
                          <Image src={deleteSrc} alt="delete" priority/>
                          <span className="underline text-ink">Delete</span>
                        </div>
                      </div>
                    ))
                  }
                  <div className="flex flex-col gap-2">
                    <button className="relative w-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4" >
                      <input ref={inputRef} type="file" multiple className="w-full h-full opacity-0 appearance-none absolute top-0 left-0 cursor-pointer" onChange={(e) => handleUploadFile(e.target.files)}/>
                      <Image src={plusSrc} alt="plus" priority/>
                      <span>Add File</span>
                    </button>
                    <div className="px-6 text-ink text-sm">File formats: .doc, .pdf, .xls</div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <div className="text-main font-semibold mb-2">Suggested FAQs</div>
                {/* <div className="flex flex-col gap-6 mb-6">
                  {
                    generatedFaqs.map((faq, index) => (
                      <div className="pb-6 border-b border-gray grid grid-cols-3 place-items-start" key={index}>
                        <div className="col-span-2 flex flex-col gap-4">
                          <div className="text-ink-500 font-semibold">Q: {faq.question}</div>
                          <div className="text-ink-500">A: {faq.answer}</div>
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
                </div> */}
                <div className="flex flex-col">
                  <span>FAQs related to the project will auto generated after project was created.</span>
                  <span>You can can add or edit this in edit mode.</span>
                  {/* <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg text-green py-2 px-4">
                    <Image src={editFreenSrc} alt="edit green" priority/>
                    <span>Write New FAQs</span>
                  </button>
                  <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg bg-green text-white py-2 px-4">
                    <Image src={lightningSrc} alt="lightning" priority/>
                    <span>Generate More FAQs</span>
                  </button> */}
                </div>
              </div>
            </div>
            <div className="min-w-full h-[1px] bg-green my-10"></div>
            <div className="flex gap-6 justify-center">
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full text-secondary py-2 px-4" onClick={() => handleCloseDialog()}>
                Cancel
              </button>
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full bg-secondary text-white py-2 px-4" onClick={() => createNewProject()}>
                Confirm and Add
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
