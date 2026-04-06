import Paths from "../core/paths";

  export default function StoryDashboardItem({story,router}){
      return<div onClick={()=>router.push(Paths.page.createRoute(story.id))}className={'border border-blue rounded-full shadow-md  py-4 bg-base-bg px-10'}>
    <div className='flex flex-col gap-2'>
      
      {/* {Enviroment.palette.text.inverse} */}
       <h4 className='text-[1.2em] text-text-soft'>{story.title.length>0?story.title:"Untitled"}</h4>
  <h6 className='text-[1em] text-text-soft'>{story.status}</h6>
  </div></div>
    }