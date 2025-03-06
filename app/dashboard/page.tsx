'use client'

import Link from "next/link";

export default function DashboardPage() {


    return (
        <div>
            <h1>Welcome</h1>
            <div className="checkbox_line mt-[26px]">
              <label htmlFor="checkbox1">
                <input type="checkbox" id="checkbox1" />
                <span className="square_block"></span>
                <span className="check_label">Show Password</span>
              </label>
            </div>
            <button type="submit" className="login_submit">Login</button>
            <Link href='/register'>Registr Now</Link>
        </div>
    );
}
