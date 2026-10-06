"use client"

import { useDemoProfile } from "./DemoProfileProvider"

export function AppliedDemoName() { return <span className="[overflow-wrap:anywhere]">{useDemoProfile().name}</span> }
