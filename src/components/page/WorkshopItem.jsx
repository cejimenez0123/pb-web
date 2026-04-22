
import truncate from "html-truncate"
import ProfileCircle from "../profile/ProfileCircle"
import { PageType } from "../../core/constants"
function WorkshopItem({workshop,router}){
  return( <div onClick={()=>{router.push(Paths.collection.createRoute(workshop.group.id),"forward")}}
className={`border rounded-xl bg-base-soft dark:bg-text-primary hover:bg-card-highlight dark:hover:bg-button-primary-hover shadow-md border border-blue dark:border-info-blue p-4 cursor-pointer transition-colors duration-200`}>
<h1 className='text-[1.4em] py-2 text-text-inverse dark:text-text-inverse'>{workshop.group.title}</h1>
<h6 className='text-text-inverse dark:text-text-secondary py-2'>Most Recent</h6>
{workshop?.story && <div className='py-2 text-text-inverse dark:text-base-surface'>{workshop?.story?.title}</div>}
{workshop?.story && workshop?.story?.type==PageType.text && <div className="text-text-inverse dark:text-base-surface p-2 rounded-xl"
dangerouslySetInnerHTML={{ __html: truncate(workshop?.story?.data ?? "", 100, {}) }}/>
}
<div className='flex flex-row text-text-inverse dark:text-base-surface py-4'>{
workshop?.group?.roles?.map((role, i) =>
<ProfileCircle key={role?.profile?.id ?? i} profile={role?.profile} includeUsername={false}/>
)
}</div>
</div>)
}
export default WorkshopItem