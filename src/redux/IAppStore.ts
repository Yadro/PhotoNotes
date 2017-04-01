import {FilterState} from "../reducers/filter";
import {NoteState} from "../reducers/notes";
import {OtherState} from "../reducers/other";
export interface AppStore {
  filter: FilterState;
  notes: NoteState;
  other: OtherState;
}