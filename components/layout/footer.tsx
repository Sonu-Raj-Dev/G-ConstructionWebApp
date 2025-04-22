import Link from "next/link"
import { ClipboardList } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer >
      {/* <div className="container py-8 md:py-12"> */}
        {/* <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <ClipboardList className="h-6 w-6" />
              <span>G-Construction</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A comprehensive management system for civil contractors to manage projects, employees, attendance, and
              payments.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/projects" className="text-muted-foreground hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employees" className="text-muted-foreground hover:text-foreground">
                  Employees
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="text-muted-foreground hover:text-foreground">
                  Reports
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Email: sonu296702@gmail.com</li>
              <li className="text-muted-foreground">Phone: +91 9969079124</li>
              <li className="text-muted-foreground">Address:Malad East, India</li>
            </ul>
          </div>
        </div> */}
        
      {/* </div> */}
      <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} G-Construction. All rights reserved.</p>
        </div>
    </footer>
  )
}
