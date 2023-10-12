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
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ICreatedProjectDataResponse, IFaqRequest, IFaqResponseItem, IProjectRequestBody } from "lib/dtos";
import moment from "moment";
import { BASE_URL, DATE_FORMAT } from "lib/constants";
import { IFile } from "../page";
import axios from "axios";

export default function ProjectList() {
  const router =useRouter();
  const {id} = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<ICreatedProjectDataResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);
  const [generatedFaqs, setGeneratedFaqs] = useState<IFaqResponseItem[]>([]);
  const [projectRequest, setProjectRequest] = useState<IProjectRequestBody>({
    name: "",
    overview: "",
    created_by: "",
    files: [],
    generate_faq: true,
  })
  const inputRef = useRef(null);
  const [newFaq, setNewFaq] = useState<IFaqRequest | null>(null);
  const emptyFaq: IFaqRequest = {
    question: "",
    answer: "",
  }
  const [searchQuestion, setSearchQuestion] = useState<string>("");
  const [searchAnswer, setSearchAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUploadFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const uploadedFiles: IFile[] = [];
      Array.from(files).forEach(item => {
        uploadedFiles.push({name: item.name, content: item})
      })
      setUploadedFiles(uploadedFiles);
    }
  }

  const editProject = () => {
    const url = BASE_URL + "/projects/" + id;
    const files = uploadedFiles.map(file => file.content);
    const data = new FormData();
    data.append("name", projectRequest.name);
    data.append("overview", projectRequest.overview);
    data.append("created_by", user ? user.name : "");
    data.append("indexing", "false");
    files.forEach(file => {
      data.append("files", file);
    })
    axios.put(url, data, {headers: { "Content-Type": "multipart/form-data" }})
      .then(() => {getProjectDetails(); setOpenDialog(false)})
      .catch(() => {})
  }

  const getProjectDetails = () => {
    if (id) {
      const url = BASE_URL + "/projects/" + id;
      
      axios.get(url)
        .then(res => {
          setProjectDetail(res.data.data);
          setProjectRequest({
            ...projectRequest,
            name: res.data.data.name,
            overview: res.data.data.overview,
            created_by: res.data.data.created_by,
          });
          setGeneratedFaqs(res.data.data.faqs);
        })
        .catch(() => {})
    }
  }

  const deleteFile = (pos: number) => {
    setUploadedFiles([...uploadedFiles].filter((item, index) => index !== pos));
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).value = "";
    }
  }

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Copied project url to clipboard")
  }

  const deleteFaq = (faq_id: number) => {
    if (!projectDetail) return
    const url = BASE_URL + "/faq/" + id + "/" + faq_id;
    axios.delete(url)
      .then(() => {
        const url = BASE_URL + "/faq/" + id;
        axios.get(url)
          .then(res => setGeneratedFaqs(res.data.data))
          .catch(() => {})
      })
  }

  const addFaq = () => {
    const url = BASE_URL + "/faq/" + id;
    axios.post(url, newFaq)
      .then(() => {
        const url = BASE_URL + "/faq/" + id;
        axios.get(url)
          .then(res => {setGeneratedFaqs(res.data.data); setNewFaq(null)})
          .catch(() => {})
      })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    getProjectDetails();
    setNewFaq(null);
  }

  const handleSearch = (key: string) => {
    if (key === "Enter") {
      setLoading(true)
      const url = BASE_URL + "/projects/" + id + "/ask?question=" + searchQuestion;
      axios.get(url)
        .then(res => setSearchAnswer(res.data.data.content))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    const localstorageUser = localStorage.getItem("user");
    if (localstorageUser) {
      setUser(JSON.parse(localstorageUser));
    }
    getProjectDetails()
  },[id])
  
  return (projectDetail && 
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
                <button className="h-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4" onClick={() => handleCopyUrl()}>
                  <Image src={copySrc} alt="plus" priority/>
                  <span>Copy Link</span>
                </button>
                <button className="h-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4" onClick={() => setOpenDialog(true)}>
                  <Image src={editSrc} alt="plus" priority width={16} height={16}/>
                  <span>Edit Project</span>
                </button>
              </div>
              <div className="text-ink-500 text-sm">
                <div>Date Created  : {moment(projectDetail.created_at).format(DATE_FORMAT)}</div>
                <div>Created By      : {projectDetail.created_by}</div>
              </div>
            </div>
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Project Overview</div>
              <div className="text-sm whitespace-pre-line">{projectDetail.overview}</div>
            </div>
            {/* <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Uploaded Files</div>
              <div className="flex flex-col gap-4">
                {
                  projectDetail.files.map((file, index) => (                
                    <div className="text-sm" key={index}>{file.name}</div>
                  ))
                }
              </div>
            </div> */}
            <div className="mb-14">
              <div className="text-main text-2xl font-semibold mb-4">Looking for Something?</div>
              <div className="w-full max-w-[560px] grid grid-cols-[auto_32px] gap-2 border border-gray rounded-lg py-4 px-6">
                <input className="focus:outline-none" placeholder="Search here" value={searchQuestion} onChange={(e) => setSearchQuestion(e.target.value)} onKeyDown={(e) => handleSearch(e.key)}/>
                <Image src={searchSrc} alt="search" priority className={classNames("cursor-pointer", {"animate-ping": loading})}/>
              </div>
              <div className={classNames({"mt-4": searchAnswer !== ""})}>
                {searchAnswer}
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
                    <div className="py-2 font-semibold flex cursor-pointer" onClick={() => setOpenFaq(faq.id !== openFaq ? faq.id : null)}>
                      <span>Q: {faq.question}</span>
                      <div className={classNames("ml-4", {"bg-secondary_light": openFaq === faq.id})}><Image src={backSrc} alt="account" priority className={classNames("-rotate-90", {"rotate-90": openFaq === faq.id})}/></div>
                    </div>
                    <div className={classNames({"max-h-0 overflow-hidden": openFaq!== faq.id}, {"max-h-fit py-2": openFaq === faq.id})}>A: {faq.answer}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      {
        openDialog &&
        <div className="w-screen h-screen overflow-y-auto absolute top-0 left-0 bg-modal flex justify-center py-[100px]">
          <div className="w-full max-w-[896px] h-fit bg-white rounded-lg p-8">
            <div className="flex justify-end mb-2"><Image src={closeSrc} alt="close" priority className="cursor-pointer" onClick={() => handleCloseDialog()}/></div>
            <div className="text-main text-2xl font-semibold mb-8">Edit Project</div>
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
                <div className="flex flex-col gap-6 mb-6">
                  {
                    generatedFaqs.map((faq, index) => (
                      <div className="pb-6 border-b border-gray grid grid-cols-3 place-items-start" key={index}>
                        <div className="col-span-2 flex flex-col gap-4 max-w-full">
                          <div className="text-ink-500 font-semibold max-w-full whitespace-pre-line">Q: {faq.question}</div>
                          <div className="text-ink-500">A: {faq.answer}</div>
                        </div>
                        <div className="flex gap-2">
                          {/* <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-secondary rounded-lg text-secondary py-2 px-4">
                            <Image src={editSrc} alt="edit" priority/>
                            <span>Edit</span>
                          </button> */}
                          <div className="flex items-center gap-2 py-2 px-4 cursor-pointer" onClick={() => deleteFaq(faq.id)}>
                            <Image src={deleteSrc} alt="delete" priority />
                            <span className="underline text-ink">Delete</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {
                  newFaq &&
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex gap-4 items-center">
                      <div className="text-ink-500 font-semibold max-w-full whitespace-pre-line">Q: </div>
                      <input className="w-full border border-gray rounded-lg py-4 px-6" value={newFaq.question} onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}/>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-ink-500 font-semibold max-w-full whitespace-pre-line">A: </div>
                      <textarea className="w-full border border-gray rounded-lg py-4 px-6" value={newFaq.answer} onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}/>
                    </div>
                  </div>
                }
                <div className="flex gap-6">
                  {
                    !newFaq &&
                    <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg text-green py-2 px-4" onClick={() => setNewFaq(emptyFaq)}>
                      <Image src={editFreenSrc} alt="edit green" priority/>
                      <span>Write New FAQs</span>
                    </button>
                  }
                  {
                    newFaq &&
                    <>
                    <button className="w-fit flex items-center gap-2 text-sm font-semibold bg-green rounded-lg text-white py-2 px-4" onClick={() => addFaq()}>
                      <span>Save New FAQs</span>
                    </button>
                    <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg text-green py-2 px-4" onClick={() => setNewFaq(null)}>
                      <span>Cancel</span>
                    </button>
                    </>
                  }
                  {/* <button className="w-fit flex items-center gap-2 text-sm font-semibold border border-green rounded-lg bg-green text-white py-2 px-4" onClick={() => generateFaqs()}>
                    <Image src={lightningSrc} alt="lightning" priority/>
                    <span>Generate FAQs</span>
                  </button> */}
                </div>
              </div>
            </div>
            <div className="min-w-full h-[1px] bg-green my-10"></div>
            <div className="flex gap-6 justify-center">
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full text-secondary py-2 px-4" onClick={() => handleCloseDialog()}>
                Cancel
              </button>
              <button className="min-w-[280px] h-[50px] text-sm font-semibold border border-secondary rounded-full bg-secondary text-white py-2 px-4" onClick={() => editProject()}>
                Confirm and Apply Edit
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
