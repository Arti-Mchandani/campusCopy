import { useParams, Form, Await, useMatches } from '@remix-run/react';
import { useWindowScroll } from 'react-use';
import { Disclosure } from '@headlessui/react';
import { Suspense, useEffect, useMemo } from 'react';
import {
  Drawer,
  useDrawer,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  Text,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import { useIsHomePath } from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useCartFetchers } from '~/hooks/useCartFetchers';

export function Layout({ children, layout }) {
 
  const { headerMenu, footerMenu, footerMenu1 } = layout;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">  
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {AnnouncementBar && <AnnouncementBar />}
        {headerMenu && <Header title={layout.shop.name} menu={headerMenu} />}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>

      {footerMenu && <Footer menus={footerMenu} menu2={footerMenu1} />}

    </>
  );
}

function Header({ title, menu }) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({ isOpen, onClose }) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({ isOpen, onClose, menu }) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({ menu, onClose }) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({ title, isHome, openCart, openMenu }) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${isHome
        ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
        } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({ isHome, menu, openCart, title }) {
  const params = useParams();
  const { y } = useWindowScroll();
  return (
    <header
      role="banner"
      className={`flex-col  ${isHome
        ? 'bg-white dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
        } ${!isHome && y > 50 && ' shadow-lightHeader'
        } hidden h-nav lg:flex items-center sticky bg-white transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 py-8`}
    >

      <div className='flex flex-row items-center w-[100%] px-12'>
        <div className='flex items-center gap-2 flex-[0_0_20%] search'>
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="flex items-center gap-2"
          >
            <button
              type="submit"
              className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            >
              <IconSearch />
            </button>
            <Input
              className={
                isHome
                  ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                  : 'focus:border-primary/20'
              }
              type="search"
              variant="minisearch"
              placeholder="Search"
              name="q"
            />

          </Form>

        </div>
        <div className="flex gap-12 flex-[0_0_60%] justify-center HeaderIcon">
          <Link className="font-bold" to="/" prefetch="intent">
            {title}
          </Link>

        </div>
        <div className="flex items-center gap-1 flex-[0_0_20%] sideIcon ">

          <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>
      <nav className="">
        {/* Top level menu items */}

        <ul className='parent_menu flex headerMenu'>
          {(menu?.items || []).map((item) => (
            <li className='parent_item'> 
             <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({ isActive }) =>
                isActive ? 'parent_item_link p-[18px] border-b -mb-px' : 'parent_item_link p-[18px]'
              }
            >
              {item.title}</Link>
             
               {item.items?.length > 0 &&
                <div className='childmenu'>
                  <ul className='flex flex-row absolute gap-[10px] bg-white w-full left-0 p-[20px]'>

                    {(item?.items || []).map((childitem) => (
                      <li className='flex-[calc(100%_/_5)]'> <Link
                        key={childitem.id}
                        to={childitem.to}
                        target={childitem.target}
                        prefetch="intent"
                        className={({ isActive }) =>
                          isActive ? 'childitem pb-1 border-b -mb-px pt-[10px] leading-[3.5rem]' : 'childitem pb-1 pt-[10px] leading-[3.5rem]'
                        }
                      >

                        {childitem.title}</Link>
                        {childitem.items.length > 0
                         && <ul className='grandchildmenu flex flex-col gap-[10px] bg-white p-[7px]'>
                          {(childitem?.items || []).map((grandchilditem) => (
                            <li> <Link
                              key={grandchilditem.id}
                              to={grandchilditem.to}
                              target={grandchilditem.target}
                              prefetch="intent"
                              className={({ isActive }) =>
                                isActive ? 'grandchilditem pb-1 border-b -mb-px' : 'grandchilditem pb-1'
                              }
                            >
                              {grandchilditem.title}

                            </Link></li>
                          ))}
                        </ul>}
                      </li>
                    ))}
                    <img className='flex-[calc(100%_/_5)]' src="https://cdn.shopify.com/s/files/1/0649/9070/7930/files/orangeshoes.jpg?v=1691998220"/>
                  </ul>
                </div>}
              
            </li>
          ))}
        </ul>
      </nav>

    </header>
  );
}

function AccountLink({ className }) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({ isHome, openCart }) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}
function AnnouncementBar() {
  return (
    <div className="flex items-center justify-center w-full bg-[#ea2929] text-contrast text-sm py-2">
      <span className="font-medium">*Get Extra 10% OFF on HDFC Bank Debit & Credit Cards_Use Code (CAMPUS10)</span>
    </div>
  );
}
function Badge({ openCart, dark, count }) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${dark
            ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
            : 'text-contrast bg-primary'
            } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer(props) {

  const isHome = useIsHomePath();
  let menu = props.menus
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`footer_campus grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(2,_minmax(0,_1fr))_351px_361px]
        bg-[#f4dfdb] text-[#787a7c] overflow-hidden`}
    >
      <div className='grid grid-flow-row'> <Heading className='menu_title text-[#171717] mb-5' size="copy" as="h4">{props.menus.title}</Heading> <FooterMenu menu={props.menus} /></div>
      <div className='grid grid-flow-row'><Heading className='menu_title text-[#171717] mb-5' size="copy" as="h4">{props.menus.title}</Heading> <FooterMenu menu={props.menu2} /></div>
      {/* <CountrySelector /> */}
      <Address />
      <Newsletter />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

function FooterLink({ item }) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}
function Address() {
  return (
    <div className='address_footer'>
      <Heading className='menu_title text-[#171717] mb-5' size="copy" as="h4">Get In Touch</Heading>
      <p className='mb-4'>For Online Orders:</p>
      <h2 className='font-bold'> Inquiry/Complaint:</h2>
      <p className='mb-4'>

        <a href="tel:+9667706012">9667706012</a>
        <br />
        <span>10:00 AM to 7:00 PM</span>
      </p>

      <h2 className='font-bold'>Any Other Queries:</h2>
      <p className='mb-4'>
        <a href="tel:+9667706012">9667706012</a>
        <br />
        <span>10:00 AM to 7:00 PM</span>
      </p>

      <h2 className='font-bold'>Email:</h2>
      <p className='mb-4'>
        <a href="mailto:customercare@campusshoes.com">customercare@campusshoes.com</a>
      </p>
    </div>
  );
}

function Newsletter() {
  return (
    <div className='newsletter_footer'>
      <Heading className='menu_title text-[#171717] mb-5' size="copy" as="h4">Newsletter</Heading>
      <Text className="flex justify-between mb-2" size="copy" as="p">Sign up for exclusive offers, original stories, activism awareness, events and more.</Text>
      <input type="text" className='newsletter_input mb-2' placeholder='Enter email' />
      <input type="submit" className="btn btn--primary" value="Sign up" />
    </div>
  )
}
function FooterMenu({ menu }) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Text className="flex justify-between mb-2 text-[#787a7c]" size="copy" as="p">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Text>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                      } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
