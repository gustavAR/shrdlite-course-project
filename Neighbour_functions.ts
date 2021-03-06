///<reference path="World.ts"/>
///<reference path="SpatialConstraints.ts"/>

module Neighbour { 
    //Lists possible next states for a given state
	export function listNeighbours(currentState : WorldState) : WorldState[] {
		var nlist : WorldState[]=[];

		if(currentState.holding==null && currentState.stacks[currentState.arm].length){
        	var n : WorldState = copyState(currentState);
			n.holding = n.stacks[n.arm].pop();
			nlist.push(n);
		}
        else if(currentState.holding && canDropHolding(currentState)) {
			var n : WorldState = copyState(currentState);
			n.stacks[n.arm].push(n.holding);
			n.holding=null;
			nlist.push(n);
		}
		if(currentState.arm > 0){
			var n : WorldState = copyState(currentState);
			n.arm = n.arm-1;
			nlist.push(n);
		}		
		if(currentState.arm < currentState.stacks.length - 1){
			var n : WorldState = copyState(currentState);
			n.arm = n.arm+1;
			nlist.push(n);
		}

		return nlist;
	}


    function copyState(s : WorldState): WorldState
    {
        var obj : WorldState = <WorldState>{ };
        obj.holding = s.holding;
        obj.arm     = s.arm;
        obj.objects = s.objects;
        obj.examples = s.examples;
        obj.stacks = [];

        for (var i = 0; i < s.stacks.length; i++)
        {
            var stack = s.stacks[i];
            obj.stacks.push([]);
            for (var j = 0; j < stack.length; j++)
            {
                obj.stacks[i].push(stack[j]);
            }
        }

        return obj;
    }
    
    function canDropHolding(s : WorldState) : boolean
    {
        //Can always drop on floor.
        if(s.stacks[s.arm].length == 0)
            return true;
       
        var held  = s.objects[s.holding];
        var under = s.objects[s.stacks[s.arm][s.stacks[s.arm].length - 1]];  
        return Spatial.canBeOntop(held, under);
    }
}