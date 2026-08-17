import Link from "next/link";
import { FiX } from "react-icons/fi";
import type { PublicNavigationItem } from "../../types";
import { HeaderBrand } from "../HeaderBrand";

type PublicMobileMenuProps = {
  isOpen: boolean;
  navigation: readonly PublicNavigationItem[];
  onClose: () => void;
}

export function PublicMobileMenu({ isOpen, navigation, onClose }: PublicMobileMenuProps){
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <nav
        id="public-navigation"
        aria-label="Navegação principal"
        className={`${ isOpen ? "flex" : "hidden" } fixed inset-y-0 left-0 z-50 h-dvh w-[85%] max-w-sm flex-col bg-[#0D1722] p-4 lg:hidden`}
      >
       <div className="mb-8 flex items-center justify-between">
         <HeaderBrand />

         <button
           type="button"
           aria-label="Fechar menu"
           className="text-white"
           onClick={onClose}
         >
          <FiX size={24}/>
         </button>
       </div>

       <ul className="flex min-h-0 flex-1 flex-col gap-4 font-medium text-white">
         {navigation.map((item) => (
           <li key={item.href}>
             <Link href={item.href} onClick={onClose}>
               {item.label}
             </Link>
           </li>
         ))}
       </ul>

       <div className="mt-auto flex flex-col gap-3 border-t border-slate-600 pt-6">
         <Link
           href="/login"
           className="rounded-md bg-sky-500 px-4 py-3 text-center font-semibold text-white"
           onClick={onClose}
         >
           Entrar
         </Link>

         <Link
           href="/register"
           className="rounded-md bg-sky-500 px-4 py-3 text-center font-semibold text-white"
           onClick={onClose}
         >
           Registrar
         </Link>
       </div>
      </nav>
    </>
  ) 
}