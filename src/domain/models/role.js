
export default class Role {
    id
    profile
    role
    item
    created
    constructor(
        id,
        profile,
        item,
        role,
        created=""
    ){
        this.id = id
        this.item=item
        this.profile = profile
        this.role = role
        this.created = created
    }
}