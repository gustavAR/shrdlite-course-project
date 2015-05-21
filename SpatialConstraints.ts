
module Spatial { 

    export function validatePDDLGoal(pddl, state : WorldState) : string
    {
        
        if(pddl.rel === "ontop" || 
                pddl.rel == "inside" || 
                pddl.rel == "under")
        {
            var objA = pddl.args[0];
            var objB = pddl.args[1];
        
            if(objA === objB)
                return "Can't put an object on itself.";
        
            
            if(pddl.rel == "under")
            {
                var tmp = objA;
                objA = objB;
                objB = tmp;
            }    
            
            //Some things cannot be placed ontop of other things.
            //But everything can be placed on the floor.
            if(pddl.args[1] !== "floor")
            {
                var a =  state.objects[objA];
                var b =  state.objects[objB];            
                if(!Spatial.canBeOntop(a, b) )
                    return Spatial.ontopError(a, b);
            }
        }
        
        return "ok";
    }
    

    function sizeCmp(a : string, b :string) {
        if(a === "large")
        {
            return b === "large" ? 0 : 1;
        }
        else if(a === "small")
        {
            return b === "small" ? 0 : -1;
        }
        else 
        {
            throw "Can't compare that size!";
        }
    }

    export function canBeOntop(over, under)
    {      
        //Balls must be in boxes or on the floor.
        if(over.form === "ball" &&
           under.form !== "box")
           return false;
        
        //Balls cannot support anything
        if(under.form === "ball")
            return false;           
        
        //Small objects cannot support large objects.
        if(over.size  === "large" && under.size === "small")
           return false;
        
        //Boxes cannot contain pyramids, planks or boxes of the same size
        if(under.form === "box" && 
           sizeCmp(under.size, over.size) == 0 &&
           (over.form === "box" || 
            over.form === "pyramids" || 
            over.form === "plank"))
        {
            return false;
        }
        
        //Small boxes cannot be supported by small bricks or pyramids.
        if(over.size === "small" &&
           under.size === "small" &&
           (under.form === "brick" || 
            under.form === "pyramid") &&
           over.form === "box")
           return false;
                   
        //Large boxes cannot be supported by large pyramids.
        if(over.size === "large" &&
           under.size === "large" &&
           under.form === "pyramid" &&
           over.form === "box")
           return false;
           
        return true;
    }
    
    export function ontopError(over, under)
    {
        return "A " + over.size +
               " "  + over.form +
               " cannot be placed " + 
               (under.form === "box" ? "inside a " : "ontop a ") + 
               under.size + " " + under.form + "."; 
    }
}