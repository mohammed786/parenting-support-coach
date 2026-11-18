export type SafetyLevel = "normal" | "emergency" | "abuse" | "self_harm";

const patterns: Record<Exclude<SafetyLevel, "normal">, RegExp[]> = {
  emergency: [
    /\b(can't|cannot|not)\s+breathe\b/i,
    /\b(stopped|stop)\s+breathing\b/i,
    /\b(unconscious|unresponsive|not waking|blue lips|turning blue)\b/i,
    /\b(seizure|convulsion|choking|severe bleeding|heavy bleeding)\b/i,
    /\b(poison(ed|ing)?|overdose|swallowed (a )?(battery|magnet|chemical|bleach))\b/i,
    /\b(immediate danger|life[- ]threatening)\b/i,
    /سانس نہیں آ رہی|بے ہوش|دورہ پڑ رہا|شدید خون بہہ رہا|زہر/,
  ],
  abuse: [
    /\b(child|kid|son|daughter|baby)\b.{0,45}\b(being abused|abuse|molest(ed|ation)?|sexually assaulted|raped)\b/i,
    /\b(abused|molested|sexually assaulted|raped)\b.{0,45}\b(child|kid|son|daughter|baby)\b/i,
    /\b(someone is hurting my child|hit(ting)? my child|violent toward my child)\b/i,
    /بچے کے ساتھ زیادتی|بچے پر تشدد|بچے کو مار/,
  ],
  self_harm: [
    /\b(i|my child|my son|my daughter|they)\b.{0,55}\b(want(s)? to die|suicid(al|e)|kill myself|self[- ]harm|hurt myself|end my life)\b/i,
    /\b(suicide attempt|attempted suicide|cutting themselves|trying to kill themselves)\b/i,
    /خودکشی|اپنے آپ کو نقصان|جان دینا/,
  ],
};

export function detectSafetyLevel(text: string): SafetyLevel {
  // Higher urgency wins if a message contains more than one signal.
  if (patterns.emergency.some((pattern) => pattern.test(text))) return "emergency";
  if (patterns.self_harm.some((pattern) => pattern.test(text))) return "self_harm";
  if (patterns.abuse.some((pattern) => pattern.test(text))) return "abuse";
  return "normal";
}

export function getEscalationMessage(level: Exclude<SafetyLevel, "normal">, isUrdu: boolean) {
  if (isUrdu) {
    if (level === "emergency") {
      return "یہ فوری ہنگامی صورتحال ہو سکتی ہے۔ ابھی اپنے مقامی ایمرجنسی نمبر پر رابطہ کریں یا قریبی ایمرجنسی ڈیپارٹمنٹ جائیں۔ بچے کو اکیلا نہ چھوڑیں۔ آن لائن جواب کا انتظار نہ کریں۔";
    }
    if (level === "abuse") {
      return "بچے کی فوری حفاظت سب سے اہم ہے۔ اگر بچہ اس وقت خطرے میں ہے تو اسے محفوظ جگہ پر لے جائیں اور مقامی ایمرجنسی سروس سے فوراً رابطہ کریں۔ کسی قابلِ اعتماد بالغ یا بچوں کے تحفظ کی مقامی سروس سے مدد لیں۔ بچے سے نرمی سے بات کریں؛ بار بار سوال نہ کریں اور خود تفتیش نہ کریں۔";
    }
    return "اس بات کو فوری اور سنجیدگی سے لیں۔ اگر آپ یا بچہ ابھی خود کو نقصان پہنچانے کے خطرے میں ہیں تو مقامی ایمرجنسی سروس سے رابطہ کریں اور کسی قابلِ اعتماد شخص کو فوراً اپنے ساتھ بلائیں۔ بچے کو اکیلا نہ چھوڑیں۔";
  }

  if (level === "emergency") {
    return "This may be a medical emergency. Contact your local emergency number now or go to the nearest emergency department. Stay with the child and do not wait for an online reply.";
  }
  if (level === "abuse") {
    return "The child's immediate safety comes first. If the child may be in danger now, move them to a safe place and contact local emergency services. Reach out to a trusted adult or local child-protection service. Listen calmly, avoid repeated questioning, and do not investigate it yourself.";
  }
  return "Please treat this as urgent. If you or the child may act on thoughts of self-harm now, contact local emergency services and bring a trusted person to you immediately. Stay with the child; do not leave them alone.";
}
