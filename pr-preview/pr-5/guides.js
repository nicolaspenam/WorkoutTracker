/**
 * Concise form guides for the catalog.
 * Cues follow common strength-coaching practice (neutral spine and brace,
 * controlled full range when the joints allow it, load stays over mid-foot).
 * These are coaching notes, not medical advice.
 */

export const EXERCISE_GUIDES = {
  "Bench Press": {
    summary: "Barbell horizontal press for the chest, with help from the triceps and front delts.",
    steps: [
      "Lie on the bench with eyes under the bar, feet planted, and a slight arch so your upper back is tight.",
      "Grip just outside shoulder width. Unrack and hold the bar over the mid-chest with locked elbows.",
      "Lower under control until the bar touches the chest, elbows about 45–75° from the torso.",
      "Press up and slightly back to the start. Keep the shoulder blades set; don’t bounce the bar.",
    ],
    mistakes: [
      "Flaring the elbows to 90° loads the shoulder joint more than the pecs — keep them tucked a bit.",
      "Bouncing off the chest or lifting the hips dumps tension and can irritate the shoulders.",
    ],
  },
  "Incline Bench Press": {
    summary: "A 15–45° incline shifts more work to the upper chest and front delts than a flat bench.",
    steps: [
      "Set the bench 15–45°. Lie back with feet down and upper back packed.",
      "Unrack over the upper chest. Lower to the upper chest / collarbone line, not the neck.",
      "Press to lockout without losing the shoulder-blade set.",
      "Use a slightly narrower grip than flat bench if the shoulders feel pinched.",
    ],
    mistakes: [
      "A very steep incline turns this into an overhead press — stay at or under ~45° for chest work.",
      "Letting the bar drift toward the face stresses the shoulders. Path is down to the upper chest.",
    ],
  },
  "Decline Bench Press": {
    summary: "A slight decline emphasizes the lower chest while the triceps still help lock out.",
    steps: [
      "Hook your legs on a decline bench and set a stable upper-back position.",
      "Unrack over the lower chest. Lower to the lower pec line with elbows slightly tucked.",
      "Press to lockout. Keep wrists stacked over the elbows.",
      "Use a controlled touch — decline makes it easy to overload and bounce.",
    ],
    mistakes: [
      "Going excessively head-down is uncomfortable and unnecessary; a mild decline is enough.",
      "Flaring hard at the bottom can crank the shoulder. Keep a consistent elbow angle.",
    ],
  },
  "Dumbbell Bench Press": {
    summary: "Dumbbells let each arm press independently and usually allow a slightly deeper stretch than a barbell.",
    steps: [
      "Sit, rest the bells on your thighs, then lie back and kick them into place over the chest.",
      "Palms face forward (or slightly in). Lower until the elbows are about in line with the torso.",
      "Press up without banging the bells together. Stop just shy of losing tension.",
      "Keep feet planted and ribs down so the low back doesn’t over-arch.",
    ],
    mistakes: [
      "Dropping the bells too far behind the shoulder can irritate the front of the joint — stay over the chest.",
      "Turning it into a fly by letting the elbows drift wide and the bells float out.",
    ],
  },
  "Incline Dumbbell Press": {
    summary: "Incline dumbbell press loads the upper chest with a long range of motion.",
    steps: [
      "Set 15–45°. Drive the bells from the thighs to over the upper chest.",
      "Lower to the sides of the upper chest with elbows slightly tucked.",
      "Press up and in a little, without clashing the bells.",
      "Keep the shoulder blades on the bench; don’t shrug the weight up.",
    ],
    mistakes: [
      "Setting the bench too steep makes this mostly front delts.",
      "Letting the wrists bend back. Stack wrist over elbow over the handle.",
    ],
  },
  "Chest Press Machine": {
    summary: "A supported horizontal press so you can load the chest without balancing a bar.",
    steps: [
      "Adjust the seat so the handles sit at mid-chest, not at the neck or belly.",
      "Plant your back and feet. Grip and brace.",
      "Press until the elbows are almost straight without snapping them.",
      "Return until you feel a chest stretch, then press again.",
    ],
    mistakes: [
      "Seat too high or low changes the groove into a shoulder press or dip — fix the seat first.",
      "Letting the shoulders roll forward at lockout. Keep the chest proud.",
    ],
  },
  "Cable Fly": {
    summary: "An isolation fly that keeps tension on the pecs through the whole arc.",
    steps: [
      "Set pulleys around chest height. Step forward with a split stance and a slight elbow bend.",
      "Start with arms open, chest tall, shoulders down.",
      "Bring the handles together in front of the chest in a hugging motion.",
      "Control the opening; don’t let the stack yank the arms behind the body.",
    ],
    mistakes: [
      "Straightening the elbows turns this into a press and stresses the elbow.",
      "Shrugging or reaching the chin forward. Keep the neck long and the scapulae down.",
    ],
  },
  "Dumbbell Fly": {
    summary: "A long-arc chest isolation. Use moderate load — the shoulder is more exposed than on a press.",
    steps: [
      "Lie on a bench, bells over the chest, palms facing each other, elbows softly bent.",
      "Open the arms in a wide arc until you feel a pec stretch (upper arms about in line with the torso).",
      "Hug the bells back together over the chest. Keep the same elbow angle the whole way.",
      "Stop the bells before they rest on each other so the pecs stay on.",
    ],
    mistakes: [
      "Going extremely deep with heavy bells is a common shoulder irritant. Range should feel like a stretch, not a stretch-plus-pain.",
      "Bending and straightening the elbows (a mini press) instead of a true fly.",
    ],
  },
  "Pec Deck": {
    summary: "Machine fly that supports the arms so you can focus on squeezing the chest.",
    steps: [
      "Sit tall with the low back against the pad. Set the seat so the elbows or forearms hit mid-chest height.",
      "Start with a chest stretch and the shoulders down.",
      "Bring the pads together without shrugging.",
      "Return under control until you feel the stretch again.",
    ],
    mistakes: [
      "Setting the start position so far back that the shoulders roll forward or pinch.",
      "Jerking the stack. This is an isolation move — smooth tension wins.",
    ],
  },
  "Cable Chest Press": {
    summary: "A standing or seated cable press that trains the chest while you brace the trunk.",
    steps: [
      "Set handles at chest height. Stagger the feet and brace the midsection.",
      "Start with elbows back, wrists stacked, handles at the sides of the chest.",
      "Press forward until the arms are long but not hyperextended.",
      "Don’t let the cables pull you into a swayback as you return.",
    ],
    mistakes: [
      "Leaning so far forward that the low back takes over. Ribs down, glutes lightly on.",
      "Pressing downward or upward because the pulleys are at the wrong height.",
    ],
  },
  "Push-ups": {
    summary: "A closed-chain chest press. Hands, trunk, and hips should move as one board.",
    steps: [
      "Hands under the shoulders (or slightly wider), body in a straight line from head to heels.",
      "Brace the abs and squeeze the glutes so the hips don’t sag or pike.",
      "Lower until the chest is close to the floor, elbows about 45° from the torso.",
      "Push the floor away and finish with the shoulder blades wrapping around the ribcage.",
    ],
    mistakes: [
      "Hips sagging or piking. If you can’t hold a line, elevate the hands.",
      "Only dipping the head. The chest should lead the descent.",
    ],
  },
  "Dips": {
    summary: "A deep pressing move. A forward lean hits more chest; a more upright torso hits more triceps.",
    steps: [
      "Support yourself on parallel bars with locked elbows and a proud chest.",
      "For chest, lean the torso forward slightly and let the elbows travel behind you.",
      "Lower until the shoulders are about at or just below the elbows, if that feels solid.",
      "Press back to lockout without shrugging into the neck.",
    ],
    mistakes: [
      "Dropping too deep with a shrug can irritate the front of the shoulder. Stop where you still own the position.",
      "Swinging the legs for momentum. Keep the descent controlled.",
    ],
  },
  "Deadlift": {
    summary: "A hip hinge that loads the posterior chain — hamstrings, glutes, and back — with the bar close to the body.",
    steps: [
      "Bar over mid-foot. Hinge, take a shoulder-width grip, and set the back flat (neutral, not rounded or hyperextended).",
      "Brace as if you’ll be tapped in the stomach. Pull the slack out of the bar.",
      "Push the floor away. The bar stays in contact with the legs as the hips and shoulders rise together.",
      "Stand tall with glutes on, then hinge back down the same path. Don’t bounce off the floor.",
    ],
    mistakes: [
      "Rounding the low back or yanking with the arms. The legs and hips drive; the arms are hooks.",
      "Letting the bar drift forward. If it leaves the legs, you lose leverage and load the spine more.",
    ],
  },
  "Barbell Row": {
    summary: "A bent-over horizontal pull for the mid-back, lats, and rear shoulders.",
    steps: [
      "Hinge to about 30–45° with a neutral spine, bar hanging at arm’s length.",
      "Brace. Row the bar toward the lower ribs / upper abs.",
      "Lead with the elbows. Squeeze the shoulder blades at the top without shrugging to the ears.",
      "Lower under control to a full hang, then repeat.",
    ],
    mistakes: [
      "Using a violent hip pop so the bar floats. A little leg drive is fine; the back should still do the row.",
      "Rounding the lumbar spine as the set gets hard. Keep the brace or lighten the load.",
    ],
  },
  "Dumbbell Row": {
    summary: "A single-arm row that trains the lats and mid-back and lets you rotate the shoulder freely.",
    steps: [
      "Hinge with one knee and hand on a bench (or both feet on the floor). The working arm hangs under the shoulder.",
      "Row the bell toward the hip / lower rib, elbow close.",
      "Pause briefly with the shoulder blade pulled in, not shrugged up.",
      "Lower until the shoulder blade can reach, then row again.",
    ],
    mistakes: [
      "Twisting the torso to swing the bell up. The hips stay quiet.",
      "Shrugging the trap instead of driving the elbow back.",
    ],
  },
  "Seated Cable Row": {
    summary: "A supported horizontal pull with constant cable tension.",
    steps: [
      "Sit tall, feet on the platform, knees softly bent. Grab the handle and sit back until the arms are long.",
      "Brace. Row the handle to the belly, elbows sweeping beside the ribs.",
      "Finish with a proud chest, not a leaned-back recline.",
      "Reach forward under control to stretch the lats, without rounding into a slump.",
    ],
    mistakes: [
      "Rocking the torso to cheat the weight. A small hinge is OK; a seesaw is not.",
      "Pulling to the neck with the elbows sky-high. That’s more rear-delt / upper trap.",
    ],
  },
  "T-Bar Row": {
    summary: "A chest-over-bar row that lets you load the mid-back hard with a neutral-ish grip.",
    steps: [
      "Straddle the bar, hinge, and grab the handles with a flat back.",
      "Row toward the lower chest / upper abs.",
      "Squeeze at the top, then lower until the plates almost touch (or the arms are long).",
      "Keep the neck in line with the torso instead of cranking up to look forward.",
    ],
    mistakes: [
      "Standing too upright so it becomes a shrug.",
      "Rounding as the plates get heavy. Brace first or drop a plate.",
    ],
  },
  "Chest-Supported Row": {
    summary: "A row with the torso braced on a pad, so the low back isn’t the limiter.",
    steps: [
      "Set the pad so your chest is supported and arms can hang freely.",
      "Row the bells or handles toward the hips / lower ribs.",
      "Pause with the shoulder blades together and down.",
      "Lower to a full hang without letting the shoulders dump forward aggressively if it pinches.",
    ],
    mistakes: [
      "Lifting the chest off the pad to cheat.",
      "Using a range so short that the scapulae never move.",
    ],
  },
  "Pull-ups": {
    summary: "An overhand vertical pull. Strong lat and upper-back builder when you own the full hang and the clear of the bar.",
    steps: [
      "Hang from a bar with a grip just outside the shoulders, ribs down, legs quiet.",
      "Depress the shoulder blades slightly, then pull the elbows down and in.",
      "Aim the chest to the bar. Chin over is the minimum; chest to bar is better if you have it.",
      "Lower all the way to a straight-arm hang with control.",
    ],
    mistakes: [
      "Kipping or kicking if the goal is strength. Save the swing for a different workout.",
      "Stopping halfway down. The lengthened hang is where a lot of the training effect is.",
    ],
  },
  "Chin-ups": {
    summary: "An underhand vertical pull that still trains the lats, with more biceps involvement than a pull-up.",
    steps: [
      "Hang with palms facing you, about shoulder-width.",
      "Brace, then pull the elbows down beside the torso.",
      "Clear the bar with the chin (or touch the chest if you can) without craning the neck.",
      "Lower to a full hang.",
    ],
    mistakes: [
      "Turning it into a biceps-only curl by never moving the shoulder blades.",
      "Half-reps at the top. Earn the hang at the bottom too.",
    ],
  },
  "Lat Pulldown": {
    summary: "A seated vertical pull you can load without needing a full pull-up yet.",
    steps: [
      "Sit with thighs under the pad. Grab the bar a little wider than the shoulders.",
      "Lean the torso a few degrees, chest up.",
      "Pull the bar to the upper chest, elbows driving toward the hips.",
      "Control the bar back up until the lats stretch.",
    ],
    mistakes: [
      "Pulling the bar behind the neck. Front-to-chest is kinder to most shoulders.",
      "Using so much lean and hip drive that the stack is swinging, not the lats working.",
    ],
  },
  "Straight-Arm Pulldown": {
    summary: "A lat isolation that teaches you to drive the upper arm to the side of the torso without bending the elbow much.",
    steps: [
      "Stand facing a high pulley, slight hinge, arms long with a soft elbow.",
      "Push the bar or rope down toward the thighs in an arc.",
      "Finish with the lats squeezed and the ribs still down.",
      "Raise until you feel a lat stretch, then repeat.",
    ],
    mistakes: [
      "Turning it into a triceps pushdown by bending the elbows a lot.",
      "Arching the low back to finish the rep. Lock the ribs down.",
    ],
  },
  "Inverted Row": {
    summary: "A bodyweight horizontal pull. Feet-forward is harder; a higher bar is easier.",
    steps: [
      "Lie under a bar or rings. Hold it and make a straight line from shoulders to heels.",
      "Pull the chest to the bar, elbows close.",
      "Pause, then lower to a straight-arm hang without sagging the hips.",
      "Move the feet to change difficulty instead of shortening the range.",
    ],
    mistakes: [
      "Leading with the chin and barely moving the chest.",
      "Letting the hips drop so the low back does the work.",
    ],
  },
  "Towel Row": {
    summary: "A no-bar row using a towel as the handle — useful when you only have bodyweight gear.",
    steps: [
      "Anchor a towel in a closed door (fabric on the far side of the door) or around a solid post at about waist-to-chest height.",
      "Hold both ends, lean back with a straight body, arms long.",
      "Row your chest toward the anchor, elbows close.",
      "Lower under control. Check that the door is fully shut and the towel can’t slip.",
    ],
    mistakes: [
      "Anchoring on a door that opens toward you, or pinching fingers in the jamb.",
      "This is a practical bodyweight stand-in, not a lab-standard lift — if the setup feels sketchy, use an inverted row instead.",
    ],
  },
  "Superman": {
    summary: "A low-load back-extension pattern for the spinal erectors and glutes.",
    steps: [
      "Lie face down, arms reaching forward or by the ears, legs long.",
      "Brace lightly. Lift the chest and legs a few inches without cranking the neck.",
      "Hold a beat, then lower with control.",
      "Keep the lift small — height is not the goal.",
    ],
    mistakes: [
      "Throwing the head back. Look at the floor; lengthen the neck.",
      "Overarching into a painful hinge. A modest lift with glutes on is enough.",
    ],
  },
  "Shrugs": {
    summary: "Upper-trap lift. Straight up and down; the arms stay long.",
    steps: [
      "Hold a bar or bells at the sides, tall posture, ribs down.",
      "Elevate the shoulders toward the ears.",
      "Pause, then lower all the way until the traps stretch.",
      "Don’t roll the shoulders in a circle.",
    ],
    mistakes: [
      "Rolling the shoulders forward/back, which doesn’t train the shrug better and can irritate the joint.",
      "Bending the elbows into a mini row.",
    ],
  },
  "Dumbbell Pullover": {
    summary: "A long-arc move that stretches the lats and can also load the pecs, depending on arm path.",
    steps: [
      "Lie on a bench, one bell held over the chest with a diamond grip or both hands on one handle.",
      "Keep a soft elbow. Lower the bell behind the head until you feel a lat stretch.",
      "Pull it back over the chest by driving the arms, not by bending the elbows into a skull crusher.",
      "Don’t let the low back fling off the bench.",
    ],
    mistakes: [
      "Going so deep the shoulders feel unstable. Stop at a stretch you control.",
      "Bending the elbows more and more so it becomes a triceps extension.",
    ],
  },
  "Machine Row": {
    summary: "A chest-supported or seated machine row for the mid-back.",
    steps: [
      "Adjust the chest pad and seat so the handles are in front of the lower chest.",
      "Grab, brace, and row the elbows back beside the ribs.",
      "Squeeze the mid-back, then reach forward to a long-arm stretch.",
      "Keep the forehead or chest on the pad if the machine has one.",
    ],
    mistakes: [
      "Yanking with the biceps and never moving the scapulae.",
      "Setting the seat so you row into the neck.",
    ],
  },
  "Assisted Pull-up": {
    summary: "A vertical pull with a counterweight so you can train the full pull-up pattern.",
    steps: [
      "Set the assistance so you can do controlled reps, not dozens of easy ones.",
      "Kneel or stand on the pad, same grip as your pull-up.",
      "Pull the chest toward the bar, then lower to a full hang.",
      "Keep the legs quiet so you don’t bounce on the knee pad.",
    ],
    mistakes: [
      "Using so much assistance that you never load the lats.",
      "Short-stroking at the bottom. Own the hang.",
    ],
  },
  "Overhead Press": {
    summary: "A standing barbell press for the delts and triceps, with the trunk bracing against the load.",
    steps: [
      "Bar on the front delts, grip just outside the shoulders, glutes and abs tight.",
      "Press up in a slight arc so the bar ends over the mid-foot, head through as it passes the face.",
      "Lock out with biceps by the ears, not with a big backbend.",
      "Lower to the shoulders under control.",
    ],
    mistakes: [
      "Leaning back into a standing bench press. If you need a huge lean, the load is too heavy or the upper back is tight.",
      "Flaring the ribs. Keep a brace so the lumbar spine isn’t hanging on the ligaments.",
    ],
  },
  "Dumbbell Shoulder Press": {
    summary: "An overhead press with independent arms, usually easier on the wrists and shoulders than a bar.",
    steps: [
      "Sit or stand tall. Bells at shoulder height, palms forward or slightly in.",
      "Press up until the arms are long without shrugging into the neck.",
      "Lower to about ear / cheekbone height so the delts stay loaded.",
      "Don’t bang the bells together hard at the top.",
    ],
    mistakes: [
      "Overarching the low back off the bench. Ribs down, feet planted.",
      "Starting with the bells way behind the head if that pinches.",
    ],
  },
  "Arnold Press": {
    summary: "A dumbbell press that starts with palms in and rotates out, covering more of the deltoid’s range.",
    steps: [
      "Start with bells in front of the shoulders, palms toward you.",
      "Press up while rotating the palms forward.",
      "Finish like a normal shoulder press, then reverse the rotation on the way down.",
      "Keep the motion smooth — rotation and press happen together.",
    ],
    mistakes: [
      "Spinning the bells with the wrists only and barely pressing.",
      "Losing the brace as you rotate. The torso stays quiet.",
    ],
  },
  "Lateral Raise": {
    summary: "Side-delt isolation. Think “pour from the elbows,” not swinging dumbbells to the ears.",
    steps: [
      "Stand tall, bells at the sides, slight bend in the elbows.",
      "Raise the arms out to about shoulder height, hands a little below or in line with the elbows.",
      "Lead with the elbows. Pause, then lower in 2–3 seconds.",
      "A slight lean forward is fine; don’t turn it into a front raise.",
    ],
    mistakes: [
      "Swinging from the hips. If you need a kick, the bells are too heavy.",
      "Shrugging the traps to finish. If the neck takes over, shorten the range or slow down.",
    ],
  },
  "Cable Lateral Raise": {
    summary: "A side-delt raise with tension at the bottom, where dumbbells usually go slack.",
    steps: [
      "Stand sideways to a low pulley, handle in the far hand, slight elbow bend.",
      "Raise to about shoulder height without leaning away hard.",
      "Lower until the cable still has tension.",
      "Keep the wrist neutral, not cocked up.",
    ],
    mistakes: [
      "Leaning so far that the torso does the lift.",
      "Raising behind the body. The arm stays slightly in front of the torso (scapular plane).",
    ],
  },
  "Front Raise": {
    summary: "Front-delt isolation. Most pressing already hits this muscle — keep the load honest.",
    steps: [
      "Bells or a plate in front of the thighs, thumbs up or palms down.",
      "Raise to eye / shoulder height with a soft elbow.",
      "Lower slowly. Don’t lean back to finish.",
      "You can alternate arms to keep the torso quieter.",
    ],
    mistakes: [
      "Swinging past the head. Extra height is mostly momentum and traps.",
      "Using a load you can only move by rocking.",
    ],
  },
  "Rear Delt Fly": {
    summary: "A horizontal abduction move for the rear delts and upper back.",
    steps: [
      "Hinge to a flat-back position, bells hanging under the shoulders, thumbs slightly in or neutral.",
      "Open the arms out to the sides until they are about in line with the torso.",
      "Think of pushing the bells apart, not rowing them to the hips.",
      "Lower under control. Keep the neck long.",
    ],
    mistakes: [
      "Turning it into a row by bending the elbows a lot and pulling to the waist.",
      "Using bells so heavy the torso heaves on every rep.",
    ],
  },
  "Face Pulls": {
    summary: "A cable pull to the face that trains rear delts and the external rotators — useful next to a lot of pressing.",
    steps: [
      "Set a rope at about face height. Grab the ends with thumbs toward you.",
      "Pull toward the face / forehead, elbows high, and rotate the hands out at the end (like showing your biceps).",
      "Squeeze the rear delts, then reach forward without rounding into a slump.",
      "Keep the neck quiet; the rope comes to you.",
    ],
    mistakes: [
      "Pulling to the belly with elbows down — that’s a row, not a face pull.",
      "Using a stack you can only move by leaning back.",
    ],
  },
  "Upright Row": {
    summary: "A vertical pull that loads the side delts and traps. Some shoulders dislike the internally rotated path — stay conservative.",
    steps: [
      "Stand tall, bar or bells at the thighs, grip about shoulder-width or a bit wider.",
      "Pull toward the lower chest / collarbone, elbows leading.",
      "Stop when the elbows are around shoulder height, not up by the ears.",
      "Lower under control. If it pinches, switch to face pulls or laterals.",
    ],
    mistakes: [
      "A narrow grip pulled to the chin is the version most often linked with shoulder irritation.",
      "Leaning back and yanking. This is not a clean pull.",
    ],
  },
  "Shoulder Press Machine": {
    summary: "A guided overhead press so you can load the delts without balancing bells.",
    steps: [
      "Seat so the handles start around shoulder height, not down at the chest.",
      "Press overhead until the arms are long, head neutral.",
      "Lower until the elbows are about in line with the torso.",
      "Keep the low back against the pad.",
    ],
    mistakes: [
      "Seat too low, so you start in a front-raise position.",
      "Cranking the neck forward to “help” the last inch.",
    ],
  },
  "Pike Push-ups": {
    summary: "A downward-dog push-up that loads the shoulders more like an overhead press.",
    steps: [
      "Start in a pike: hips high, head between the arms, hands under the shoulders.",
      "Bend the elbows and lower the head toward the floor between the hands.",
      "Press back to the pike. Keep the hips up so it doesn’t become a regular push-up.",
      "Elevate the feet if you need more load.",
    ],
    mistakes: [
      "Letting the hips drop so it’s just a close-grip push-up.",
      "Crashing the head into the floor. Control the last few inches.",
    ],
  },
  "Cable Shoulder Press": {
    summary: "An overhead press against cables, so you have to brace the trunk as you press.",
    steps: [
      "Set handles at shoulder height. Stagger the stance and brace.",
      "Press overhead until the arms are long.",
      "Lower to the shoulders without leaning back.",
      "Keep the wrists stacked; don’t let the cables twist you.",
    ],
    mistakes: [
      "Turning it into a standing chest press by setting the pulleys too low.",
      "Overarching to finish the lockout.",
    ],
  },
  "Machine Lateral Raise": {
    summary: "A supported side-delt raise with a fixed path.",
    steps: [
      "Adjust the pads to sit on the elbows or upper arms, not the wrists if the machine allows.",
      "Raise to about shoulder height without shrugging.",
      "Lower until the delts stretch, then repeat.",
      "Sit tall; don’t lean away from the stack.",
    ],
    mistakes: [
      "Using the hands to yank a pad that’s meant to sit on the elbow.",
      "Bouncing out of the bottom.",
    ],
  },
  "Prone Y Raise": {
    summary: "A light, long-lever raise for the lower traps and shoulders — usually a control drill, not a heavy lift.",
    steps: [
      "Lie face down on the floor or a bench, arms reaching into a Y, thumbs up.",
      "Lift the arms a few inches without lifting the head.",
      "Hold a second, then lower.",
      "Keep the range small and the neck long.",
    ],
    mistakes: [
      "Using heavy bells. This pattern falls apart fast with load.",
      "Cranking the low back to get the arms higher.",
    ],
  },
  "Dumbbell Curl": {
    summary: "Elbow-flexion work for the biceps. The shoulder stays quiet; only the forearm moves.",
    steps: [
      "Stand or sit tall, bells at the sides, palms forward (or start hammer and turn).",
      "Curl until the biceps shorten fully, elbows close to the ribs.",
      "Lower to a straight arm without swinging.",
      "You can rotate the pinky up a bit at the top for a stronger squeeze.",
    ],
    mistakes: [
      "Swinging the torso or letting the elbows drift way behind or forward.",
      "Stopping halfway down. The lengthened portion is worth owning.",
    ],
  },
  "Barbell Curl": {
    summary: "A bilateral biceps curl you can load simply. An EZ bar is a valid stand-in if the wrists complain.",
    steps: [
      "Stand with the bar at the thighs, grip about shoulder-width.",
      "Curl in an arc to the upper chest, elbows pinned roughly at the sides.",
      "Squeeze, then lower until the arms are long.",
      "Keep the ribs down so you don’t lean back.",
    ],
    mistakes: [
      "Turning it into a mini clean with hip drive.",
      "Dragging the bar up the shirt (that’s a different lift). Let it arc.",
    ],
  },
  "Hammer Curl": {
    summary: "A thumbs-up curl that loads the brachialis and brachioradialis as well as the biceps.",
    steps: [
      "Hold bells at the sides, palms facing in.",
      "Curl without rotating the wrists.",
      "Keep the elbows close. Lower fully.",
      "Don’t let the bells drift out in front of the body.",
    ],
    mistakes: [
      "Swinging. If the bells need a kick, go lighter.",
      "Shrugging the shoulders to the ears at the top.",
    ],
  },
  "Preacher Curl": {
    summary: "A curl with the upper arm braced, which makes it harder to cheat and stresses the lengthened biceps.",
    steps: [
      "Sit so the armpits sit near the top of the pad, chest against it.",
      "Start with a nearly straight arm. Curl without the shoulders shrugging off the pad.",
      "Lower slowly to a controlled stretch — don’t hyperextend the elbow.",
      "Use an EZ bar if a straight bar bothers the wrists.",
    ],
    mistakes: [
      "Leaning back off the pad to finish heavy reps.",
      "Dropping into a dead hang that hurts the elbow. Keep a tiny bend at the bottom if needed.",
    ],
  },
  "Incline Dumbbell Curl": {
    summary: "A curl on an incline so the biceps start in a stretch (shoulder extended).",
    steps: [
      "Set the bench ~45–60°. Let the arms hang straight, palms forward.",
      "Curl without swinging the upper arm forward.",
      "Lower all the way until the biceps stretch again.",
      "Keep the head on the bench; don’t crane up.",
    ],
    mistakes: [
      "Letting the elbows drift forward so you lose the stretch.",
      "Using a bench so flat that the shoulders feel unstable at the bottom.",
    ],
  },
  "Cable Curl": {
    summary: "A biceps curl with even tension, including at the top where a dumbbell can go slack.",
    steps: [
      "Stand facing a low pulley, elbows at the sides.",
      "Curl toward the shoulders without leaning back.",
      "Squeeze, then lower until the arms are long and the cable still pulls.",
      "A straight bar, EZ, or rope all work; keep the elbows still.",
    ],
    mistakes: [
      "Stepping too close and turning it into an upright row.",
      "Using the hips to start the stack moving.",
    ],
  },
  "Concentration Curl": {
    summary: "A seated single-arm curl with the elbow braced on the inner thigh — high tension, low cheat.",
    steps: [
      "Sit, brace the working elbow against the inner thigh, bell hanging.",
      "Curl toward the shoulder without swinging the torso.",
      "Squeeze, then lower to a straight arm.",
      "Switch arms and match the range.",
    ],
    mistakes: [
      "Leaning back to toss the bell up.",
      "Cutting the bottom of the rep.",
    ],
  },
  "Machine Curl": {
    summary: "A preacher-style or pad-supported curl with a fixed path.",
    steps: [
      "Adjust the seat so the elbows line up with the machine’s pivot.",
      "Curl through a full range, shoulders down.",
      "Lower until the biceps stretch without slamming the stack.",
      "Keep the wrists straight.",
    ],
    mistakes: [
      "Seat too high or low so the elbows aren’t at the axis — the groove will feel wrong.",
      "Yanking the first inch with the shoulders.",
    ],
  },
  "Towel Curl": {
    summary: "A no-dumbbell biceps curl using a towel for tension — handy on a bodyweight-only day.",
    steps: [
      "Stand on the middle of a towel and hold both ends, or loop it under a foot.",
      "Curl against the towel as if it were a bar, elbows at the sides.",
      "You can also do a slow isometric: pull as if curling and hold 20–30 seconds.",
      "Keep the torso still. Match both arms.",
    ],
    mistakes: [
      "This is a field-expedient variation, not a standard gym study lift. If it feels awkward, use a backpack, band, or hang a towel over a bar.",
      "Shrugging instead of flexing the elbows.",
    ],
  },
  "Tricep Pushdown": {
    summary: "A cable elbow-extension that loads all three triceps heads with a simple groove.",
    steps: [
      "Stand tall at a high pulley, elbows pinned to the ribs, bar or handle in hand.",
      "Extend the elbows until the arms are straight without leaning over the stack.",
      "Squeeze the triceps, then let the bar rise only as far as you can keep the elbows still.",
      "Ribs down; don’t turn it into a crunch.",
    ],
    mistakes: [
      "Letting the elbows flare and drift forward so the shoulders take over.",
      "Using so much load that you have to bounce and lean.",
    ],
  },
  "Rope Pushdown": {
    summary: "A pushdown that lets you spread the rope at the bottom for a stronger triceps squeeze.",
    steps: [
      "Same setup as a bar pushdown, rope in both hands.",
      "Extend the elbows, then pull the rope ends slightly apart at lockout.",
      "Keep the upper arms glued to the sides.",
      "Return until the forearms are about parallel to the floor, or a bit higher if the elbows stay put.",
    ],
    mistakes: [
      "Spreading the rope by swinging the elbows out instead of extending them.",
      "Chopping the range so you never reach a straight arm.",
    ],
  },
  "Skull Crushers": {
    summary: "A lying triceps extension. The bells or bar travel toward the forehead or just behind it.",
    steps: [
      "Lie on a bench, bar or bells over the shoulders, elbows pointing up.",
      "Bend only the elbows and lower toward the forehead or just past the head.",
      "Extend back to the start without swinging the upper arms.",
      "A slight back-angle of the upper arms (toward the head) keeps tension on the triceps.",
    ],
    mistakes: [
      "Flaring the elbows wildly. Keep them about shoulder-width.",
      "Turning it into a pullover by moving the shoulders more than the elbows.",
    ],
  },
  "Overhead Tricep Extension": {
    summary: "An overhead elbow extension that stretches the long head of the triceps.",
    steps: [
      "Hold a bell or cable overhead with the elbows next to the ears.",
      "Lower the weight behind the head by bending only the elbows.",
      "Stop at a stretch you control, then extend to lockout.",
      "Keep the ribs down so you don’t turn it into a backbend.",
    ],
    mistakes: [
      "Flaring the elbows out to the sides until the shoulders take over.",
      "Using a bell so heavy you have to throw it up.",
    ],
  },
  "Close-Grip Bench Press": {
    summary: "A bench press with a narrower grip so the triceps work harder on the lockout.",
    steps: [
      "Grip about shoulder-width (not a tiny “hands together” grip).",
      "Lower to the lower chest with elbows closer to the body than a wide bench.",
      "Press to lockout. Keep the wrists stacked.",
      "Upper back stays tight, feet down.",
    ],
    mistakes: [
      "An extremely close grip that cranks the wrists and doesn’t help the triceps more.",
      "Bouncing the bar. The triceps need a controlled press.",
    ],
  },
  "Tricep Dips": {
    summary: "Dips done more upright so the triceps, not the chest, lead the press.",
    steps: [
      "On parallel bars or a sturdy bench, keep the torso fairly vertical.",
      "Lower until the elbows are about 90°, shoulders packed down.",
      "Press to lockout. Bench dips: keep the hips close to the bench.",
      "Stop if the front of the shoulder complains at the bottom.",
    ],
    mistakes: [
      "On bench dips, dropping far with the shoulders rolled forward is a common irritant.",
      "Flaring the elbows completely out. Keep them tracking back.",
    ],
  },
  "Kickbacks": {
    summary: "A lightweight triceps isolation with the upper arm held in line with the torso.",
    steps: [
      "Hinge, upper arm glued to the side, elbow already at 90°.",
      "Extend the elbow until the arm is straight.",
      "Squeeze, then return only to 90° so the upper arm never drops.",
      "Use a load you can pause with. This is not a row.",
    ],
    mistakes: [
      "Swinging the whole arm from the shoulder.",
      "Using a bell you can only move with a hip pop.",
    ],
  },
  "Diamond Push-ups": {
    summary: "A close-hand push-up that biases the triceps more than a standard push-up.",
    steps: [
      "Hands under the chest, thumbs and index fingers close (a diamond is optional; close is enough).",
      "Body in a plank. Lower until the chest is over the hands.",
      "Press up without letting the hips sag.",
      "If the wrists complain, use a closer-than-normal but not stacked hand position, or use parallettes.",
    ],
    mistakes: [
      "Flaring the elbows to 90° and turning it into a struggling wide push-up.",
      "Piking the hips to make the lockout easier.",
    ],
  },
  "Machine Tricep Extension": {
    summary: "A supported elbow extension with a fixed path.",
    steps: [
      "Line the elbows up with the machine’s pivot.",
      "Extend to a straight arm without slamming.",
      "Return to a stretch with the upper arms still on the pad.",
      "Keep the shoulders down.",
    ],
    mistakes: [
      "Seat set so the elbows aren’t at the axis.",
      "Shoving with the shoulders at the start of each rep.",
    ],
  },
  "Squat": {
    summary: "A barbell back squat: knees and hips share the load, with the bar over mid-foot.",
    steps: [
      "Bar on the upper back (high-bar) or rear delts (low-bar). Brace, then walk out.",
      "Sit the hips down and back while the knees track over the mid-foot / toes.",
      "Go as deep as you can keep a neutral spine — parallel or below if mobility allows.",
      "Drive the floor away and stand without the knees caving or the chest collapsing.",
    ],
    mistakes: [
      "Letting the knees collapse in. Push them in the same direction as the toes.",
      "Losing the brace and rounding the low back at the bottom (butt wink that you can’t control). Reduce depth or widen the stance slightly.",
    ],
  },
  "Front Squat": {
    summary: "A squat with the bar on the front delts, which keeps the torso more upright and hits the quads hard.",
    steps: [
      "Rack the bar on the shoulders, elbows up (clean grip or crossed arms).",
      "Brace. Squat down between the knees, chest tall.",
      "Depth is whatever you can do without the elbows dropping and dumping the bar.",
      "Stand by driving the elbows up, not by folding forward.",
    ],
    mistakes: [
      "Letting the elbows drop so the bar rolls off. Elbows are the shelf.",
      "Heels lifting because you’re too far forward. Stay over mid-foot.",
    ],
  },
  "Goblet Squat": {
    summary: "A dumbbell-at-the-chest squat that’s easy to coach and kind to most backs.",
    steps: [
      "Hold a bell at the sternum, elbows pointing down.",
      "Squat between the knees until the elbows brush the inner thighs, if mobility allows.",
      "Keep the chest proud and the heels down.",
      "Stand by pushing the floor away. The bell stays glued to the chest.",
    ],
    mistakes: [
      "Holding the bell far out in front so the low back fights the moment.",
      "Collapsing the chest onto the bell.",
    ],
  },
  "Hack Squat": {
    summary: "A machine squat with the back supported, so you can load the quads without balancing a bar.",
    steps: [
      "Shoulders under the pads, feet on the platform about shoulder-width, a bit forward if you want more quad.",
      "Unrack, brace, and squat until the thighs are at least parallel if the hips allow it.",
      "Knees track the toes. Don’t let them cave.",
      "Press through the whole foot. Don’t slam the safeties.",
    ],
    mistakes: [
      "Feet too high so it becomes almost a hip hinge, or too low so the heels lift.",
      "Letting the low back peel off the pad at the bottom.",
    ],
  },
  "Leg Press": {
    summary: "A supported squat pattern. Foot placement changes the bias, but the spine should stay glued to the seat.",
    steps: [
      "Sit with the low back and hips against the pad. Feet about shoulder-width on the platform.",
      "Unlock, then lower until the knees are at least ~90° without the hips rolling up.",
      "Press to a soft lockout — don’t snap the knees.",
      "Higher feet = more hip; lower feet = more knee. Pick one you can control.",
    ],
    mistakes: [
      "Letting the pelvis tuck and the low back round at the bottom (a loaded spinal flexion).",
      "Locking out violently. Keep a slight knee bend if you’re prone to hyperextension.",
    ],
  },
  "Bulgarian Split Squat": {
    summary: "A rear-foot-elevated split squat. Huge quad and glute demand one leg at a time.",
    steps: [
      "Rear foot on a bench, front foot far enough that the front shin can stay fairly vertical.",
      "Drop the back knee toward the floor. Front knee tracks the toes.",
      "Torso slightly forward is fine for glutes; more upright hits quads.",
      "Push through the front foot to stand. Don’t bounce the back knee.",
    ],
    mistakes: [
      "Front foot too close, so the heel lifts and the knee shoots far past a range you own.",
      "Slamming the back knee. Control the bottom.",
    ],
  },
  "Walking Lunge": {
    summary: "A traveling split squat. Each step is a single-leg squat with the other knee dropping toward the floor.",
    steps: [
      "Step forward far enough that both knees can bend about 90°.",
      "Front knee tracks the toes; back knee goes down, not slamming.",
      "Push through the front foot and bring the other leg through into the next step.",
      "Keep the torso stacked. A slight forward lean is OK if the back stays flat.",
    ],
    mistakes: [
      "Tiny steps that turn this into a knee-only chop.",
      "The front knee diving inward. Point it where the toes point.",
    ],
  },
  "Leg Extension": {
    summary: "A machine isolation for the quads, including the rectus femoris that hip-extension work under-trains.",
    steps: [
      "Align the knee with the machine’s pivot. Pad sits on the shin, not the ankle bone if you can help it.",
      "Extend until the knees are straight, without throwing the torso back.",
      "Lower until the knees are bent and the quads stretch.",
      "Use a range that doesn’t hurt the knees; a slightly shorter bottom is OK.",
    ],
    mistakes: [
      "Swinging the stack with the whole body.",
      "Setting the pad so far out that the lever arm beats up the knee.",
    ],
  },
  "Step-up": {
    summary: "A single-leg press onto a box. The working leg is the one on the box, not the trailing one.",
    steps: [
      "Use a box about knee height (lower if you lose balance).",
      "Whole front foot on the box. Lean slightly over that leg.",
      "Stand up by pushing the box away — trailing leg stays lazy.",
      "Lower under control. Don’t crash the trailing foot.",
    ],
    mistakes: [
      "Pushing off the back foot so it’s a jump, not a single-leg squat.",
      "A box so high you have to hike the hip and dump the low back.",
    ],
  },
  "Sissy Squat": {
    summary: "A long-range quad isolation: knees travel forward while the hips stay relatively extended. High demand on the knees — stay conservative.",
    steps: [
      "Stand tall, hold a support. Rise onto the balls of the feet if needed.",
      "Let the knees travel forward and the torso lean back as a unit, hips relatively open.",
      "Go only as far as the knees feel solid, then straighten to stand.",
      "Keep the abs tight so you don’t fold at the waist.",
    ],
    mistakes: [
      "Forcing a deep lean with angry knees. This is optional; leg extensions train a similar pattern with more control.",
      "Bending at the hips into a regular squat and calling it a sissy squat.",
    ],
  },
  "Cable Squat": {
    summary: "A squat against a cable — usually a goblet-style hold or a low pulley between the legs as a light belt-squat stand-in.",
    steps: [
      "Face away or toward a low-to-mid pulley. Hold a handle at the chest, or a rope between the legs against the hips.",
      "Brace and squat with heels down, knees tracking the toes.",
      "Stand by pushing the floor away. Don’t let the cable yank you off balance.",
      "Pick a pulley height that lets you stay over mid-foot.",
    ],
    mistakes: [
      "Standing too far from the stack so you get pulled onto the toes.",
      "Turning it into a stiff-leg pull by hinging instead of squatting.",
    ],
  },
  "Cable Lunge": {
    summary: "A split squat or reverse lunge with a cable for extra load or counterbalance.",
    steps: [
      "Hold a handle at the chest or at the sides. Step back or forward into a lunge.",
      "Drop the back knee under control. Front knee tracks the toes.",
      "Push through the front foot to stand.",
      "Keep the cable from twisting you; square the hips.",
    ],
    mistakes: [
      "Letting the cable rotate the torso so one hip dumps.",
      "A tiny range that never loads the front thigh.",
    ],
  },
  "Romanian Deadlift": {
    summary: "A hip hinge with a slight knee bend. The hamstrings and glutes lengthen under load as the bar slides down the legs.",
    steps: [
      "Stand tall with the bar at the hips, soft knees, lats on (bar against the thighs).",
      "Push the hips back. The bar stays in contact with the legs.",
      "Stop when the hamstrings are stretched and the back is still flat — often mid-shin, not the floor.",
      "Drive the hips forward to stand. Don’t hyperextend at the top.",
    ],
    mistakes: [
      "Turning it into a squat by bending the knees a lot.",
      "Rounding the back to reach the floor. Depth is to the hinge, not to the plates.",
    ],
  },
  "Stiff-Leg Deadlift": {
    summary: "A closer-to-straight-knee hinge. More hamstring stretch, less knee bend than an RDL — go lighter.",
    steps: [
      "Start standing, knees almost straight but not locked.",
      "Hinge at the hips, bar close, spine long.",
      "Stop at a hamstring stretch you can own, then return by squeezing the glutes.",
      "Think “hips back,” not “chest down.”",
    ],
    mistakes: [
      "Locking the knees hard, which often dumps the stress into the low back.",
      "Reaching for the floor with a round spine.",
    ],
  },
  "Lying Leg Curl": {
    summary: "A prone machine curl that isolates the hamstrings at the knee.",
    steps: [
      "Lie face down, pad just above the heels, hips glued to the bench.",
      "Curl the heels toward the glutes without lifting the hips.",
      "Squeeze, then lower until the knees are almost straight.",
      "Point the toes slightly or stay neutral — pick what you feel in the hamstrings, not the calves.",
    ],
    mistakes: [
      "Popping the hips off the pad to finish. That’s lumbar extension, not a better curl.",
      "Using a pad position that crushes the Achilles and makes you cheat.",
    ],
  },
  "Seated Leg Curl": {
    summary: "A seated knee curl. The hip is flexed, which changes the hamstring length compared with a lying curl.",
    steps: [
      "Sit with the back pad against you and the thigh pad locked down.",
      "Line the knees with the pivot. Curl the heels under the seat.",
      "Squeeze, then extend the knees under control.",
      "Don’t let the hips slide forward.",
    ],
    mistakes: [
      "Lifting the butt to yank the stack.",
      "Slamming into a fully straight knee if it bothers the joint — leave a soft end range.",
    ],
  },
  "Nordic Curl": {
    summary: "A partner- or pad-anchored eccentric hamstring curl. Slow lowering is the training effect.",
    steps: [
      "Kneel, ankles held (partner, pad, or a loaded bar). Body in a tall plank from the knees up.",
      "Brace. Lower the torso forward as slowly as you can, hips extended.",
      "Catch with the hands, then push back or curl up if you can.",
      "Quality over range. A slow half-rep beats a falling full-rep.",
    ],
    mistakes: [
      "Breaking at the hips into a bow. The hinge should stay open so the hamstrings work.",
      "Dropping like a tree. The eccentric is the point.",
    ],
  },
  "Good Morning": {
    summary: "A loaded hip hinge with the bar on the back. Treat it like an RDL for the hamstrings and spinal erectors.",
    steps: [
      "Bar on the upper back, brace, soft knees.",
      "Push the hips back until the torso is toward parallel, back flat.",
      "Stop if the back rounds. Stand by driving the hips forward.",
      "Start light. This lever is long.",
    ],
    mistakes: [
      "Squatting down instead of hinging.",
      "Looking up and over-arching the neck and lumbar spine.",
    ],
  },
  "Dumbbell Romanian Deadlift": {
    summary: "The RDL pattern with bells, which hang at the sides and teach you to keep the load over mid-foot.",
    steps: [
      "Bells at the thighs, soft knees, proud chest.",
      "Hinge until the bells pass the knees and the hamstrings stretch.",
      "Keep the bells close to the legs.",
      "Stand by squeezing the glutes, not by yanking the traps.",
    ],
    mistakes: [
      "Letting the bells drift forward so the low back fights them.",
      "Rounding to reach the floor.",
    ],
  },
  "Single-Leg Romanian Deadlift": {
    summary: "A single-leg hinge that trains hamstrings, glutes, and balance.",
    steps: [
      "Stand on one foot, soft knee. Hinge, sending the back leg behind you as a counterbalance.",
      "Keep the hips square — don’t open like a teapot.",
      "Lower until you feel the stance-leg hamstring, then return to stand.",
      "A light bell in the opposite hand often helps the hips stay level.",
    ],
    mistakes: [
      "Rotating the pelvis open so it’s a twist, not a hinge.",
      "Looking up and over-arching. Gaze at the floor a few feet ahead.",
    ],
  },
  "Sliding Leg Curl": {
    summary: "A hamstring curl using sliders or a towel: hips stay up while the heels pull in.",
    steps: [
      "Lie on your back, heels on sliders, hips bridged up.",
      "Straighten the legs slowly, then curl the heels back toward the glutes without dropping the hips.",
      "Keep the ribs down. Squeeze the glutes to hold the bridge.",
      "Bend the knees more or do one leg to change difficulty.",
    ],
    mistakes: [
      "Letting the hips crash as the legs straighten. That’s the hard part — shorten the range if needed.",
      "Turning it into a sit-up. The trunk stays quiet.",
    ],
  },
  "Back Extension": {
    summary: "A hip-hinge on a 45° or horizontal bench. Glutes and hamstrings should do most of the work, not a cranked lumbar spine.",
    steps: [
      "Pad at the hips, not the waist. Start folded, spine long.",
      "Extend until the body is in a straight line — not a hyperextended “look at the ceiling” finish.",
      "Squeeze the glutes at the top, then lower under control.",
      "Arms across the chest or a plate at the chest if you load it.",
    ],
    mistakes: [
      "Coming up so high you compress the low back. Neutral is the finish.",
      "Pad too high so you fold through the lumbar spine.",
    ],
  },
  "Cable Leg Curl": {
    summary: "A standing or kneeling cable curl for one hamstring at a time.",
    steps: [
      "Ankle strap on a low pulley, standing tall or slightly hinged, holding a support.",
      "Curl the heel toward the glute without swinging the hip forward.",
      "Squeeze, then lower until the leg is long.",
      "Keep the working thigh quiet.",
    ],
    mistakes: [
      "Kicking from the hip like a donkey kick. This is a knee curl.",
      "Leaning so far that the low back does the motion.",
    ],
  },
  "Hip Thrust": {
    summary: "A horizontal hip extension. Peak glute squeeze is at lockout with a posterior pelvic tilt, not a rib-flaring backbend.",
    steps: [
      "Upper back on a bench, bar in the hip crease (pad it). Feet about shoulder-width, shins vertical at the top.",
      "Brace. Drive through the heels until the hips are fully open.",
      "At the top, squeeze the glutes and tuck the pelvis slightly (ribs toward the hips).",
      "Lower until the hips are just above the floor, then repeat.",
    ],
    mistakes: [
      "Hyperextending the low back to “get higher.” Height at the cost of a rib flare is not more glute.",
      "Feet so far forward it becomes a hamstring curl, or so close the knees shoot past a range you own.",
    ],
  },
  "Glute Bridge": {
    summary: "The floor version of a hip thrust. Same idea: hips up, glutes on, ribs down.",
    steps: [
      "Lie on your back, knees bent, feet flat.",
      "Drive through the heels and lift the hips to a straight line from shoulders to knees.",
      "Squeeze the glutes at the top. Don’t crank the neck.",
      "Lower with control. Pause at the top if bodyweight feels easy.",
    ],
    mistakes: [
      "Pushing through the toes and cramping the quads more than the glutes.",
      "Overarching the low back. Posteriorly tilt a little at lockout.",
    ],
  },
  "Sumo Deadlift": {
    summary: "A wide-stance deadlift. More hip and adductor, a more upright torso than a conventional pull.",
    steps: [
      "Stance wide, toes out, bar over mid-foot. Take a narrow grip between the knees.",
      "Sit the hips down, chest up, shins against the bar.",
      "Push the floor apart and stand. Lock the hips, don’t lean back.",
      "Lower with the same wide stance. Keep the bar close.",
    ],
    mistakes: [
      "Hips shooting up first so it becomes a stiff-leg pull with a wide stance.",
      "Knees caving in. Drive them out over the toes.",
    ],
  },
  "Cable Kickback": {
    summary: "A standing hip-extension isolation for the glute. Small range, strict torso.",
    steps: [
      "Ankle strap on a low pulley. Hinge slightly, hold a support.",
      "Kick the working leg back without arching the low back.",
      "Squeeze the glute at the end, then return without twisting.",
      "Think “heel to the wall behind you,” not “toes to the ceiling.”",
    ],
    mistakes: [
      "Swinging the whole torso. If you have to rock, the stack is too heavy.",
      "Turning it into a lumbar extension. Ribs stay down.",
    ],
  },
  "Hip Abduction": {
    summary: "A machine (or cable) move that takes the thigh out to the side — glute medius work for hip stability.",
    steps: [
      "Sit or stand per the machine. Pads on the outside of the knees or ankles.",
      "Push the legs apart against the pad without leaning the torso.",
      "Pause, then return under control.",
      "Don’t use momentum to bounce out of the start.",
    ],
    mistakes: [
      "Slumping or using the hands to yank the seat.",
      "A tiny range that never challenges the mid-glute.",
    ],
  },
  "Reverse Lunge": {
    summary: "A lunge that steps backward. Often easier on the front knee than a long walking lunge.",
    steps: [
      "Step back far enough that both knees can bend.",
      "Drop the back knee toward the floor. Front shin fairly vertical.",
      "Push through the front heel to stand and bring the feet together.",
      "A slight forward torso lean is fine if the back stays flat.",
    ],
    mistakes: [
      "A tiny back step that turns this into a knee-only dip.",
      "The front knee diving in. Track it over the mid-foot.",
    ],
  },
  "Dumbbell Hip Thrust": {
    summary: "A hip thrust with a bell on the hips when you don’t have a bar.",
    steps: [
      "Upper back on a bench, dumbbell sitting in the hip crease (hold it there).",
      "Feet planted, shins vertical at the top.",
      "Drive to a glute squeeze with the ribs down, then lower.",
      "If the bell rolls, use a pad or a single heavier bell.",
    ],
    mistakes: [
      "Same as the barbell version: rib flare instead of a glute lockout.",
      "Letting the bell slide onto the belly so the load isn’t on the hips.",
    ],
  },
  "Single-Leg Glute Bridge": {
    summary: "A one-leg floor bridge. The working glute has to stabilize the pelvis too.",
    steps: [
      "Lie on your back, one foot planted, the other leg reaching up or bent in the air.",
      "Drive the planted heel and lift the hips without letting one side drop.",
      "Squeeze, then lower under control.",
      "Keep the hips square. If they rotate, shorten the range.",
    ],
    mistakes: [
      "Twisting so the working hip hikes. Imagine a glass of water on the belt.",
      "Pushing through the toes. Heel stays down.",
    ],
  },
  "Cable Pull-Through": {
    summary: "A cable hip hinge: you face away from the stack and snap the hips through. Glute and hamstring biased.",
    steps: [
      "Straddle a low rope or handle, face away, walk out until the cable is tight.",
      "Hinge, sending the hips back, then drive them forward to stand.",
      "Finish with glutes on, not a backbend.",
      "The arms stay long; they are just the attachment.",
    ],
    mistakes: [
      "Squatting down instead of hinging.",
      "Pulling with the arms like a row.",
    ],
  },
  "Standing Calf Raise": {
    summary: "Ankle plantarflexion with a relatively straight knee, which loads the gastrocnemius.",
    steps: [
      "Balls of the feet on a step, heels free. Hold a support or a machine pad.",
      "Drop the heels into a stretch, then rise as high as you can onto the big-toe side of the foot.",
      "Pause at the top, then lower slowly.",
      "Knees stay softly straight — not locked violently, not bent into a squat.",
    ],
    mistakes: [
      "Bouncing out of the stretch. The calf wants a pause at both ends.",
      "Rolling onto the outside of the foot. Drive through the first two toes.",
    ],
  },
  "Seated Calf Raise": {
    summary: "Plantarflexion with the knee bent, which biases the soleus.",
    steps: [
      "Sit, pad on the thighs, balls of the feet on the platform.",
      "Lower the heels to a stretch, then raise as high as possible.",
      "Pause at the top. Don’t slam the weight stack.",
      "Keep the motion at the ankle, not by rocking the torso.",
    ],
    mistakes: [
      "Tiny pulses in the middle of the range.",
      "Using the hands to lift the pad.",
    ],
  },
  "Donkey Calf Raise": {
    summary: "A hip-hinged calf raise (machine or partner). The gastrocnemius works with a long hip.",
    steps: [
      "Hinge or use the donkey machine so the torso is supported, knees mostly straight.",
      "Stretch the heels down, then rise high on the forefoot.",
      "Pause, then lower slowly.",
      "Don’t turn it into a row or a squat.",
    ],
    mistakes: [
      "Bending the knees so much it becomes a seated pattern.",
      "Cutting the stretch at the bottom.",
    ],
  },
  "Dumbbell Calf Raise": {
    summary: "A standing calf raise holding bells. Same rules as the machine: full stretch, full squeeze.",
    steps: [
      "Hold bells, stand on a step or the floor. Optional: one leg at a time.",
      "Heels down, then up onto the toes.",
      "Pause at both ends. Use a wall for balance if needed.",
      "Keep the knees quietly straight.",
    ],
    mistakes: [
      "Hopping. Slow calves down.",
      "Letting the bells swing and pull you forward.",
    ],
  },
  "Cable Calf Raise": {
    summary: "A standing calf raise with a low handle or belt for extra load.",
    steps: [
      "Hold a low handle at the side or in front, or use a belt attachment.",
      "Rise onto the forefoot and lower into a stretch.",
      "Don’t let the cable pull you off the ball of the foot.",
      "Pause at the top, then lower into the stretch without bouncing.",
    ],
    mistakes: [
      "Leaning back and turning it into a hip motion.",
      "Using a pulley height that wrecks the balance so you can’t pause.",
    ],
  },
  "Plank": {
    summary: "An anti-extension drill: the abs prevent the low back from sagging, they don’t “pulse.”",
    steps: [
      "Elbows under the shoulders (or hands for a high plank), body in a straight line.",
      "Squeeze the glutes, brace the abs, and tuck the pelvis slightly so the low back isn’t arched.",
      "Breathe. Hold without letting the hips pike or drop.",
      "If you shake, shorten the hold or drop to the knees while keeping a straight line from knees to head.",
    ],
    mistakes: [
      "Hips sagging into a swayback. That’s lumbar extension, not a stronger plank.",
      "Hips piking into a downward dog. Push the floor away and squeeze the glutes.",
    ],
  },
  "Side Plank": {
    summary: "An anti-lateral-flexion hold for the obliques and the side of the hip.",
    steps: [
      "On one elbow, elbow under the shoulder, feet stacked or staggered.",
      "Lift the hips until the body is a straight line. Don’t roll forward or back.",
      "Press the floor away so the shoulder isn’t shrugged into the ear.",
      "Hold, then switch sides. Drop to the bottom knee if you need to.",
    ],
    mistakes: [
      "Hips sagging toward the floor or piking up.",
      "Rotating the chest toward the floor so it’s no longer a side plank.",
    ],
  },
  "Hanging Leg Raise": {
    summary: "A hanging anti-extension / hip-flexion drill. Rolling the pelvis up trains the abs more than swinging straight legs.",
    steps: [
      "Hang with the ribs down and a slight hollow (don’t hang in a swayback).",
      "Raise the legs by curling the pelvis toward the ribs, not by only kicking from the hips.",
      "Lower without swinging. Bent knees are a valid regression.",
      "If the grip fails first, use straps or a captain’s chair.",
    ],
    mistakes: [
      "Kipping the legs up with a huge swing.",
      "Only flexing the hips with an arched back — that’s mostly hip flexors. Tuck the pelvis.",
    ],
  },
  "Cable Crunch": {
    summary: "A kneeling crunch against a cable. The spine flexes on purpose; the hips stay relatively still.",
    steps: [
      "Kneel facing a high pulley, rope at the shoulders.",
      "Crunch the ribs toward the hips. The hips don’t sit back into a child’s pose.",
      "Squeeze the abs, then rise until the abs stretch without yanking the neck.",
      "Keep the motion in the trunk, not a hip hinge.",
    ],
    mistakes: [
      "Turning it into a lat pulldown or a sit-back.",
      "Yanking the neck with the rope. The abs move the ribcage.",
    ],
  },
  "Ab Wheel": {
    summary: "A rollout that trains the abs to resist extension as the arms travel overhead.",
    steps: [
      "Kneel, wheel under the shoulders, brace like a plank.",
      "Roll forward only as far as you can keep the ribs down and the low back from sagging.",
      "Pull the wheel back by the abs and lats, not by snapping the hips.",
      "Stop short of failure-form. A small honest range beats a collapsed long one.",
    ],
    mistakes: [
      "Letting the hips sag into a banana. That’s the back, not the abs, taking the load.",
      "Starting standing if you can’t yet control a kneeling rollout.",
    ],
  },
  "Russian Twist": {
    summary: "A rotational sit-up variant. Rotate the ribcage, don’t just swing the arms.",
    steps: [
      "Sit with a lean, heels down or up, torso long.",
      "Rotate the chest from side to side. A bell or plate can sit at the chest.",
      "Touch the load beside the hip if you want a target, then rotate the other way.",
      "Breathe. Don’t hold a death-crunch in the neck.",
    ],
    mistakes: [
      "Waving the arms while the torso stays still.",
      "Rounding so aggressively the low back feels pinched. Keep some length in the spine.",
    ],
  },
  "Pallof Press": {
    summary: "An anti-rotation press. The abs and obliques fight the cable that wants to twist you.",
    steps: [
      "Stand side-on to a mid-height cable, handle at the chest, feet stacked.",
      "Brace, then press the handle straight out. The cable will try to rotate you — don’t let it.",
      "Hold a beat with the arms long, then bring the handle back.",
      "Switch sides. Half-kneeling makes it more honest.",
    ],
    mistakes: [
      "Letting the hips or shoulders spin toward the stack.",
      "Pressing so far that you have to lean. The arms go out; the torso stays stacked.",
    ],
  },
  "Dead Bug": {
    summary: "A floor anti-extension drill: opposite arm and leg reach while the low back stays heavy on the floor.",
    steps: [
      "Lie on your back, arms up, knees over the hips. Press the low back gently into the floor.",
      "Reach one arm back and the opposite leg out without the back peeling up.",
      "Return and switch. Breathe out as you reach.",
      "Shorter reaches if the back arches.",
    ],
    mistakes: [
      "Letting the low back pop off the floor as the leg straightens. That’s the set ending.",
      "Moving both legs together so it becomes a hollow rock with no control.",
    ],
  },
  "Dumbbell Sit-up": {
    summary: "A weighted sit-up. Flex the trunk on purpose; don’t yank the neck.",
    steps: [
      "Lie with knees bent, bell at the chest or locked out above you.",
      "Sit up by curling the ribs toward the hips, then lower with control.",
      "If the bell is overhead, keep it stacked over the shoulders.",
      "Anchor the feet only if you need to; unanchored is more abs, less hip flexor.",
    ],
    mistakes: [
      "Pulling on the neck. Chin slightly tucked, abs do the curl.",
      "Flopping down. The lowering is training too.",
    ],
  },
  "Ab Crunch Machine": {
    summary: "A supported crunch. Line the axis with the mid-torso and shorten the distance from ribs to hips.",
    steps: [
      "Adjust the seat so the pads sit on the upper back / shoulders, pivot at about navel height.",
      "Crunch the ribs down. Exhale.",
      "Return until the abs stretch without slamming the stack.",
      "Don’t yank with the arms more than the trunk.",
    ],
    mistakes: [
      "Using the hip flexors by yanking the thighs instead of curling the spine.",
      "Seat set so you are just doing a mini sit-up from the hips.",
    ],
  },
  "Barbell Rollout": {
    summary: "An ab-wheel pattern with a barbell. Same rule: don’t let the low back sag as the bar travels out.",
    steps: [
      "Kneel, hands on a loaded bar. Brace like a plank.",
      "Roll the bar forward only as far as the ribs stay down.",
      "Pull it back with the abs and lats.",
      "Plates that roll smoothly help. Start small.",
    ],
    mistakes: [
      "Collapsing into an arched back at the end of the roll.",
      "Bending the arms into a skull-crusher path. The arms stay fairly long.",
    ],
  },
};

export function getExerciseGuide(name, guides = EXERCISE_GUIDES) {
  if (!name) return null;
  return guides[name] ?? null;
}

export function isGuideComplete(guide) {
  return Boolean(
    guide &&
      typeof guide.summary === "string" &&
      guide.summary.trim().length >= 40 &&
      Array.isArray(guide.steps) &&
      guide.steps.length >= 3 &&
      guide.steps.length <= 7 &&
      guide.steps.every((step) => typeof step === "string" && step.trim().length >= 20) &&
      Array.isArray(guide.mistakes) &&
      guide.mistakes.length >= 2 &&
      guide.mistakes.length <= 5 &&
      guide.mistakes.every((item) => typeof item === "string" && item.trim().length >= 20)
  );
}
