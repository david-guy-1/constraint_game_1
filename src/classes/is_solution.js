import run_level from "./run_level.js";

// checks if the given thing is a solution
function is_solution(level, solution){
	var run_level_1 = new run_level(level, solution);
	while(true){
		var progress_made = false;
		for(var hero of level.starts){
			// try to move each one	
			if(run_level_1.exited[hero] == false){
				if(run_level_1.can_move(hero)){
					progress_made = true;
					run_level_1.do_move(hero, false);
				}
			}
		}
		if(progress_made == false){
			break;
		}
	}
	// check if all heroes have exited
	for(var hero of level.starts){
		if(run_level_1.exited[hero] == false){
			return false;
		}	
	}
	return true;
}

export default is_solution