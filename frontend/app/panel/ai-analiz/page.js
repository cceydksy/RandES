"use client";
import { useState } from "react";
import { analyzeRisk } from "@/lib/api";
const DT={"yuksek":"Yüksek","orta":"Orta","dusuk":"Düşük"};
export default function AIAnaliz(){
  const[res,setRes]=useState(null);const[lod,setLod]=useState(false);
  async function baslat(){setLod(true);try{const r=await analyzeRisk();if(r.success)setRes(r)}catch(e){console.error(e)}finally{setLod(false)}}
  return(<div>
    <div className="ph"><h1>AI Müşteri Analizi</h1><p>Müşteri kayıp riskini yapay zeka ile analiz edin</p></div>
    <div className="card" style={{textAlign:"center",marginBottom:24}}><p style={{color:"var(--text-light)",fontSize:13,marginBottom:16,maxWidth:500,margin:"0 auto 16px"}}>Tamamlanmış randevuları analiz ederek yenileme süresi geçen müşterileri tespit eder.</p><button className="btn btn-p" onClick={baslat} disabled={lod}>{lod?"Analiz yapılıyor...":"Analizi Başlat"}</button></div>
    {res&&<><div className="st-g">{[["Toplam Müşteri",res.summary?.totalCustomers,null],["Risk Altında",res.summary?.atRiskCount,"var(--danger)"],["Güvende",res.summary?.safeCount,"var(--success)"],["Risk Oranı",res.summary?.riskRate,null]].map(([l,v,c])=>(<div className="st-c" key={l}><div className="st-l">{l}</div><div className="st-v" style={c?{color:c}:{}}>{v||0}</div></div>))}</div>
    {res.data?.atRisk?.length>0&&<div style={{marginBottom:24}}><h3 className="sec-t" style={{color:"var(--danger)"}}>Risk Altındaki Müşteriler</h3><div className="card-g">{res.data.atRisk.map((m,i)=>(<div className="card" key={i} style={{borderLeft:`3px solid ${m.riskLevel==="yuksek"?"var(--danger)":"var(--warning)"}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><h4 style={{fontSize:14,fontWeight:600}}>{m.customerName}</h4><span className={`badge badge-${m.riskLevel==="yuksek"?"d":"w"}`}>{DT[m.riskLevel]||m.riskLevel}</span></div><p style={{fontSize:11,color:"var(--text-light)",marginBottom:10}}>Son: {m.lastService} · {m.daysSinceLastVisit} gün önce</p><div style={{background:"var(--cream)",padding:12,borderRadius:8,fontSize:12,lineHeight:1.6}}>{m.reminderMessage}</div></div>))}</div></div>}
    {res.data?.safe?.length>0&&<div><h3 className="sec-t" style={{color:"var(--success)"}}>Güvendeki Müşteriler</h3><div className="card"><table><thead><tr><th>Müşteri</th><th>Son Hizmet</th><th>Son Ziyaret</th><th>Kalan</th></tr></thead><tbody>{res.data.safe.map((m,i)=>(<tr key={i}><td>{m.customerName}</td><td>{m.lastService}</td><td>{m.daysSinceLastVisit} gün önce</td><td><span className="badge badge-s">{m.daysUntilRenewal} gün</span></td></tr>))}</tbody></table></div></div>}
    </>}
  </div>);
}
