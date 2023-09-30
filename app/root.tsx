import { json,redirect } from "@remix-run/node";
import { useEffect } from "react";
import {
  Form,
  Links,
 // Link,
  NavLink,
  LiveReload,
  Meta,
  Scripts,
  Outlet,
  useNavigation,
  useLoaderData,
  ScrollRestoration,
  useSubmit,
} from "@remix-run/react";

import type { LinksFunction,LoaderFunctionArgs, } from "@remix-run/node";
// existing imports
import appStylesHref from "./app.css";
import { getContacts,createEmptyContact, } from "./data";

// existing imports


//creating a new form
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

// existing code

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];


// export const loader = async () => {
//   const contacts = await getContacts();
//   return json({ contacts });
// };

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};


export default function App() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const { contacts, q } = useLoaderData<typeof loader>();
  const searching =
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form"   onChange={(event) =>
                submit(event.currentTarget)
              } role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
                hidden={!searching}
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    
                    {/* <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link> */}
                    <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                 {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                </NavLink>







                    
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div  className={
            navigation.state === "loading" ? "loading" : ""
          }
          id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}