how i use claude, part 2

plan mode, add all context, attach files, specs, thinking. instruct to understand current flow/surface area e2e, in detail, can be helpful to also have it map it out using states/diagram/ascii. "interview me in detail using the AskUserQuestionTool about literally anything: technical implementation, UI & UX, concerns, tradeoffs, etc. but make sure the questions are not obvious". context is everything. be intentional, think hard about what you want the model to consider & use to plan changes. have been using superwhisper more to just talk out loud my thoughts.

refine plan, make sure its up to standards & expectations, instruct to think critically, ensure follows existing best practices & patterns etc, make things reusable, have unit tests that make sense and add value, test key integration points. sometimes can be helpful to rope in gpt 5.3 codex at this stage to make sure you're not missing anything. take your time

have claude create a doc in a notes dir or project root with the implementation plan and relevant context, this will come in handy

let claude cook, if smaller feature just do it in same session. if larger or alot of tokens for plan(s), context, create new session, re-ground with plan file(s) & relevant context. sweet spot is 40-70% context used, after that, inconsistent results 

review every change, ask questions, consider downstream impacts, is this the best approach? can we simplify this? make faster, get details right on ui. phone gpt 5.3 codex, have it review the changes, anything we can simplify, any considerations we missed?

use images. can pass alot of context in an image. use cleanshot to annotate images.

commit iteratively, git not scary anymore. let claude handle conflicts, commit strategy, split PRs, rebase, etc

instruct to make sure changes pass linter, tests pass

draft PR, review once again in github, question everything 

ship it

smaller stuff: 
i tend to not globabally set permissions for editting, etc. i like manually accepting things, help steer, drive things rather than let model loose. etc. 
use codex to review things. especially backend. review this PR/git diff e2e, undestand the flow e2e, is intent clear? anything we can simplify? anything we can do better? why did we do this.., can we do this differently? is this following best practices & patterns? what are potential side effects with this change that i might have missed?  
mcps like playwright, skills, slash commands ive used inconsistently, just prompting, basic refinement over and over and staying in the loop has worked well for me