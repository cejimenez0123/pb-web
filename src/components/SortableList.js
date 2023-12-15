import {SortableContainer, SortableElement,sortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable,arrayMoveMutable }from 'array-move';
import { Remove,DragIndicator } from "@mui/icons-material"
import {IconButton} from "@mui/material"
import {  useState } from 'react';
import { useEffect } from 'react';
const SortableItem = SortableElement(({value,handleRemove,index}) =>{
    const {item } = value
    if(item){
           
            
        return(
<div>
            <div key={`${value.uId}`}className="sort-item">
            <h5>{item.title}</h5>
            <div className="button-row">
       <IconButton onClick={()=>{
        handleRemove(index)}}>
        <Remove/>
       </IconButton>
       <DragHandle/>
            </div>
        </div>
        </div>)
        
    }else{

    return(
    <div><div key={`${value.uId}`} className="sort-item">  
            <h1>Page Deleted</h1>
           </div> </div>
    )
    }
    });
    const targetHasProp = (
        target,
        hasProp,
      ) => {
        while (target) {
          if (hasProp(target)) {
            return true;
          }
      
          target = target.parentElement;
        }
        return false;
      };
const shouldCancelSortStart = (coach)=> {
        return targetHasProp(coach.target , (el) => {
          return ['button'].includes(el.tagName.toLowerCase());
        });
      };
const SortableList = SortableContainer(({items,handleRemove}) => {
  return (
    <ul>
      {items.map((value, index) => {
       return( <div>
        <SortableItem key={`item-`+value.uId} handleRemove={()=>{
         
            handleRemove(value,index)
        }} index={index} idx={index} value={value} />
        </div> )})}
    </ul>
  );
});
const DragHandle = sortableHandle(() => <IconButton>
<DragIndicator/>
</IconButton>);



const SortableComponent = ({items, getItems }) => {
  const [newItems, setNewItems] = useState(items);

  useEffect(()=>{
    getItems(newItems)
  },[newItems])
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setNewItems((prevState) => {
       let list = prevState
        return arrayMoveImmutable(list, oldIndex, newIndex)
    });
  };
  const remove = (value) => {
    const newitems = newItems.filter((item) => item !== value);
    setNewItems(newitems);
  };

  


  return (
    <div>
      <SortableList
        axis="y"
        useDragHandle
        items={newItems}
        shouldCancelSortStart={shouldCancelSortStart}
        onSortEnd={onSortEnd}
        handleRemove={(value) => remove(value)}
      />
    </div>
  );
};


export default SortableComponent