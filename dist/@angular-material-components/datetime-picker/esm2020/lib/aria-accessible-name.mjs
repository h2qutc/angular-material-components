// This file contains the `_computeAriaAccessibleName` function, which computes what the *expected*
// ARIA accessible name would be for a given element. Implements a subset of ARIA specification
// [Accessible Name and Description Computation 1.2](https://www.w3.org/TR/accname-1.2/).
//
// Specification accname-1.2 can be summarized by returning the result of the first method
// available.
//
//  1. `aria-labelledby` attribute
//     ```
//       <!-- example using aria-labelledby-->
//       <label id='label-id'>Start Date</label>
//       <input aria-labelledby='label-id'/>
//     ```
//  2. `aria-label` attribute (e.g. `<input aria-label="Departure"/>`)
//  3. Label with `for`/`id`
//     ```
//       <!-- example using for/id -->
//       <label for="current-node">Label</label>
//       <input id="current-node"/>
//     ```
//  4. `placeholder` attribute (e.g. `<input placeholder="06/03/1990"/>`)
//  5. `title` attribute (e.g. `<input title="Check-In"/>`)
//  6. text content
//     ```
//       <!-- example using text content -->
//       <label for="current-node"><span>Departure</span> Date</label>
//       <input id="current-node"/>
//     ```
/**
 * Computes the *expected* ARIA accessible name for argument element based on [accname-1.2
 * specification](https://www.w3.org/TR/accname-1.2/). Implements a subset of accname-1.2,
 * and should only be used for the Datepicker's specific use case.
 *
 * Intended use:
 * This is not a general use implementation. Only implements the parts of accname-1.2 that are
 * required for the Datepicker's specific use case. This function is not intended for any other
 * use.
 *
 * Limitations:
 *  - Only covers the needs of `matStartDate` and `matEndDate`. Does not support other use cases.
 *  - See NOTES's in implementation for specific details on what parts of the accname-1.2
 *  specification are not implemented.
 *
 *  @param element {HTMLInputElement} native &lt;input/&gt; element of `matStartDate` or
 *  `matEndDate` component. Corresponds to the 'Root Element' from accname-1.2
 *
 *  @return expected ARIA accessible name of argument &lt;input/&gt;
 */
export function _computeAriaAccessibleName(element) {
    return _computeAriaAccessibleNameInternal(element, true);
}
/**
 * Determine if argument node is an Element based on `nodeType` property. This function is safe to
 * use with server-side rendering.
 */
function ssrSafeIsElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
/**
 * Determine if argument node is an HTMLInputElement based on `nodeName` property. This funciton is
 * safe to use with server-side rendering.
 */
function ssrSafeIsHTMLInputElement(node) {
    return node.nodeName === 'INPUT';
}
/**
 * Determine if argument node is an HTMLTextAreaElement based on `nodeName` property. This
 * funciton is safe to use with server-side rendering.
 */
function ssrSafeIsHTMLTextAreaElement(node) {
    return node.nodeName === 'TEXTAREA';
}
/**
 * Calculate the expected ARIA accessible name for given DOM Node. Given DOM Node may be either the
 * "Root node" passed to `_computeAriaAccessibleName` or "Current node" as result of recursion.
 *
 * @return the accessible name of argument DOM Node
 *
 * @param currentNode node to determine accessible name of
 * @param isDirectlyReferenced true if `currentNode` is the root node to calculate ARIA accessible
 * name of. False if it is a result of recursion.
 */
function _computeAriaAccessibleNameInternal(currentNode, isDirectlyReferenced) {
    // NOTE: this differs from accname-1.2 specification.
    //  - Does not implement Step 1. of accname-1.2: '''If `currentNode`'s role prohibits naming,
    //    return the empty string ("")'''.
    //  - Does not implement Step 2.A. of accname-1.2: '''if current node is hidden and not directly
    //    referenced by aria-labelledby... return the empty string.'''
    // acc-name-1.2 Step 2.B.: aria-labelledby
    if (ssrSafeIsElement(currentNode) && isDirectlyReferenced) {
        const labelledbyIds = currentNode.getAttribute?.('aria-labelledby')?.split(/\s+/g) || [];
        const validIdRefs = labelledbyIds.reduce((validIds, id) => {
            const elem = document.getElementById(id);
            if (elem) {
                validIds.push(elem);
            }
            return validIds;
        }, []);
        if (validIdRefs.length) {
            return validIdRefs
                .map(idRef => {
                return _computeAriaAccessibleNameInternal(idRef, false);
            })
                .join(' ');
        }
    }
    // acc-name-1.2 Step 2.C.: aria-label
    if (ssrSafeIsElement(currentNode)) {
        const ariaLabel = currentNode.getAttribute('aria-label')?.trim();
        if (ariaLabel) {
            return ariaLabel;
        }
    }
    // acc-name-1.2 Step 2.D. attribute or element that defines a text alternative
    //
    // NOTE: this differs from accname-1.2 specification.
    // Only implements Step 2.D. for `<label>`,`<input/>`, and `<textarea/>` element. Does not
    // implement other elements that have an attribute or element that defines a text alternative.
    if (ssrSafeIsHTMLInputElement(currentNode) || ssrSafeIsHTMLTextAreaElement(currentNode)) {
        // use label with a `for` attribute referencing the current node
        if (currentNode.labels?.length) {
            return Array.from(currentNode.labels)
                .map(x => _computeAriaAccessibleNameInternal(x, false))
                .join(' ');
        }
        // use placeholder if available
        const placeholder = currentNode.getAttribute('placeholder')?.trim();
        if (placeholder) {
            return placeholder;
        }
        // use title if available
        const title = currentNode.getAttribute('title')?.trim();
        if (title) {
            return title;
        }
    }
    // NOTE: this differs from accname-1.2 specification.
    //  - does not implement acc-name-1.2 Step 2.E.: '''if the current node is a control embedded
    //     within the label... then include the embedded control as part of the text alternative in
    //     the following manner...'''. Step 2E applies to embedded controls such as textbox, listbox,
    //     range, etc.
    //  - does not implement acc-name-1.2 step 2.F.: check that '''role allows name from content''',
    //    which applies to `currentNode` and its children.
    //  - does not implement acc-name-1.2 Step 2.F.ii.: '''Check for CSS generated textual content'''
    //    (e.g. :before and :after).
    //  - does not implement acc-name-1.2 Step 2.I.: '''if the current node has a Tooltip attribute,
    //    return its value'''
    // Return text content with whitespace collapsed into a single space character. Accomplish
    // acc-name-1.2 steps 2F, 2G, and 2H.
    return (currentNode.textContent || '').replace(/\s+/g, ' ').trim();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJpYS1hY2Nlc3NpYmxlLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9hcmlhLWFjY2Vzc2libGUtbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxtR0FBbUc7QUFDbkcsK0ZBQStGO0FBQy9GLHlGQUF5RjtBQUN6RixFQUFFO0FBQ0YsMEZBQTBGO0FBQzFGLGFBQWE7QUFDYixFQUFFO0FBQ0Ysa0NBQWtDO0FBQ2xDLFVBQVU7QUFDViw4Q0FBOEM7QUFDOUMsZ0RBQWdEO0FBQ2hELDRDQUE0QztBQUM1QyxVQUFVO0FBQ1Ysc0VBQXNFO0FBQ3RFLDRCQUE0QjtBQUM1QixVQUFVO0FBQ1Ysc0NBQXNDO0FBQ3RDLGdEQUFnRDtBQUNoRCxtQ0FBbUM7QUFDbkMsVUFBVTtBQUNWLHlFQUF5RTtBQUN6RSwyREFBMkQ7QUFDM0QsbUJBQW1CO0FBQ25CLFVBQVU7QUFDViw0Q0FBNEM7QUFDNUMsc0VBQXNFO0FBQ3RFLG1DQUFtQztBQUNuQyxVQUFVO0FBRVY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLFVBQVUsMEJBQTBCLENBQ3hDLE9BQStDO0lBRS9DLE9BQU8sa0NBQWtDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGdCQUFnQixDQUFDLElBQVU7SUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMseUJBQXlCLENBQUMsSUFBVTtJQUMzQyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO0FBQ25DLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLDRCQUE0QixDQUFDLElBQVU7SUFDOUMsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFVBQVUsQ0FB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b250ZW50IjpbIlxuXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIGBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZWAgZnVuY3Rpb24sIHdoaWNoIGNvbXB1dGVzIHdoYXQgdGhlICpleHBlY3RlZCpcbi8vIEFSSUEgYWNjZXNzaWJsZSBuYW1lIHdvdWxkIGJlIGZvciBhIGdpdmVuIGVsZW1lbnQuIEltcGxlbWVudHMgYSBzdWJzZXQgb2YgQVJJQSBzcGVjaWZpY2F0aW9uXG4vLyBbQWNjZXNzaWJsZSBOYW1lIGFuZCBEZXNjcmlwdGlvbiBDb21wdXRhdGlvbiAxLjJdKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9hY2NuYW1lLTEuMi8pLlxuLy9cbi8vIFNwZWNpZmljYXRpb24gYWNjbmFtZS0xLjIgY2FuIGJlIHN1bW1hcml6ZWQgYnkgcmV0dXJuaW5nIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IG1ldGhvZFxuLy8gYXZhaWxhYmxlLlxuLy9cbi8vICAxLiBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGVcbi8vICAgICBgYGBcbi8vICAgICAgIDwhLS0gZXhhbXBsZSB1c2luZyBhcmlhLWxhYmVsbGVkYnktLT5cbi8vICAgICAgIDxsYWJlbCBpZD0nbGFiZWwtaWQnPlN0YXJ0IERhdGU8L2xhYmVsPlxuLy8gICAgICAgPGlucHV0IGFyaWEtbGFiZWxsZWRieT0nbGFiZWwtaWQnLz5cbi8vICAgICBgYGBcbi8vICAyLiBgYXJpYS1sYWJlbGAgYXR0cmlidXRlIChlLmcuIGA8aW5wdXQgYXJpYS1sYWJlbD1cIkRlcGFydHVyZVwiLz5gKVxuLy8gIDMuIExhYmVsIHdpdGggYGZvcmAvYGlkYFxuLy8gICAgIGBgYFxuLy8gICAgICAgPCEtLSBleGFtcGxlIHVzaW5nIGZvci9pZCAtLT5cbi8vICAgICAgIDxsYWJlbCBmb3I9XCJjdXJyZW50LW5vZGVcIj5MYWJlbDwvbGFiZWw+XG4vLyAgICAgICA8aW5wdXQgaWQ9XCJjdXJyZW50LW5vZGVcIi8+XG4vLyAgICAgYGBgXG4vLyAgNC4gYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgKGUuZy4gYDxpbnB1dCBwbGFjZWhvbGRlcj1cIjA2LzAzLzE5OTBcIi8+YClcbi8vICA1LiBgdGl0bGVgIGF0dHJpYnV0ZSAoZS5nLiBgPGlucHV0IHRpdGxlPVwiQ2hlY2stSW5cIi8+YClcbi8vICA2LiB0ZXh0IGNvbnRlbnRcbi8vICAgICBgYGBcbi8vICAgICAgIDwhLS0gZXhhbXBsZSB1c2luZyB0ZXh0IGNvbnRlbnQgLS0+XG4vLyAgICAgICA8bGFiZWwgZm9yPVwiY3VycmVudC1ub2RlXCI+PHNwYW4+RGVwYXJ0dXJlPC9zcGFuPiBEYXRlPC9sYWJlbD5cbi8vICAgICAgIDxpbnB1dCBpZD1cImN1cnJlbnQtbm9kZVwiLz5cbi8vICAgICBgYGBcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgKmV4cGVjdGVkKiBBUklBIGFjY2Vzc2libGUgbmFtZSBmb3IgYXJndW1lbnQgZWxlbWVudCBiYXNlZCBvbiBbYWNjbmFtZS0xLjJcbiAqIHNwZWNpZmljYXRpb25dKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9hY2NuYW1lLTEuMi8pLiBJbXBsZW1lbnRzIGEgc3Vic2V0IG9mIGFjY25hbWUtMS4yLFxuICogYW5kIHNob3VsZCBvbmx5IGJlIHVzZWQgZm9yIHRoZSBEYXRlcGlja2VyJ3Mgc3BlY2lmaWMgdXNlIGNhc2UuXG4gKlxuICogSW50ZW5kZWQgdXNlOlxuICogVGhpcyBpcyBub3QgYSBnZW5lcmFsIHVzZSBpbXBsZW1lbnRhdGlvbi4gT25seSBpbXBsZW1lbnRzIHRoZSBwYXJ0cyBvZiBhY2NuYW1lLTEuMiB0aGF0IGFyZVxuICogcmVxdWlyZWQgZm9yIHRoZSBEYXRlcGlja2VyJ3Mgc3BlY2lmaWMgdXNlIGNhc2UuIFRoaXMgZnVuY3Rpb24gaXMgbm90IGludGVuZGVkIGZvciBhbnkgb3RoZXJcbiAqIHVzZS5cbiAqXG4gKiBMaW1pdGF0aW9uczpcbiAqICAtIE9ubHkgY292ZXJzIHRoZSBuZWVkcyBvZiBgbWF0U3RhcnREYXRlYCBhbmQgYG1hdEVuZERhdGVgLiBEb2VzIG5vdCBzdXBwb3J0IG90aGVyIHVzZSBjYXNlcy5cbiAqICAtIFNlZSBOT1RFUydzIGluIGltcGxlbWVudGF0aW9uIGZvciBzcGVjaWZpYyBkZXRhaWxzIG9uIHdoYXQgcGFydHMgb2YgdGhlIGFjY25hbWUtMS4yXG4gKiAgc3BlY2lmaWNhdGlvbiBhcmUgbm90IGltcGxlbWVudGVkLlxuICpcbiAqICBAcGFyYW0gZWxlbWVudCB7SFRNTElucHV0RWxlbWVudH0gbmF0aXZlICZsdDtpbnB1dC8mZ3Q7IGVsZW1lbnQgb2YgYG1hdFN0YXJ0RGF0ZWAgb3JcbiAqICBgbWF0RW5kRGF0ZWAgY29tcG9uZW50LiBDb3JyZXNwb25kcyB0byB0aGUgJ1Jvb3QgRWxlbWVudCcgZnJvbSBhY2NuYW1lLTEuMlxuICpcbiAqICBAcmV0dXJuIGV4cGVjdGVkIEFSSUEgYWNjZXNzaWJsZSBuYW1lIG9mIGFyZ3VtZW50ICZsdDtpbnB1dC8mZ3Q7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZShcbiAgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gX2NvbXB1dGVBcmlhQWNjZXNzaWJsZU5hbWVJbnRlcm5hbChlbGVtZW50LCB0cnVlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYXJndW1lbnQgbm9kZSBpcyBhbiBFbGVtZW50IGJhc2VkIG9uIGBub2RlVHlwZWAgcHJvcGVydHkuIFRoaXMgZnVuY3Rpb24gaXMgc2FmZSB0b1xuICogdXNlIHdpdGggc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICovXG5mdW5jdGlvbiBzc3JTYWZlSXNFbGVtZW50KG5vZGU6IE5vZGUpOiBub2RlIGlzIEVsZW1lbnQge1xuICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFyZ3VtZW50IG5vZGUgaXMgYW4gSFRNTElucHV0RWxlbWVudCBiYXNlZCBvbiBgbm9kZU5hbWVgIHByb3BlcnR5LiBUaGlzIGZ1bmNpdG9uIGlzXG4gKiBzYWZlIHRvIHVzZSB3aXRoIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAqL1xuZnVuY3Rpb24gc3NyU2FmZUlzSFRNTElucHV0RWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBIVE1MSW5wdXRFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUubm9kZU5hbWUgPT09ICdJTlBVVCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFyZ3VtZW50IG5vZGUgaXMgYW4gSFRNTFRleHRBcmVhRWxlbWVudCBiYXNlZCBvbiBgbm9kZU5hbWVgIHByb3BlcnR5LiBUaGlzXG4gKiBmdW5jaXRvbiBpcyBzYWZlIHRvIHVzZSB3aXRoIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAqL1xuZnVuY3Rpb24gc3NyU2FmZUlzSFRNTFRleHRBcmVhRWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBIVE1MVGV4dEFyZWFFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUubm9kZU5hbWUgPT09ICdURVhUQVJFQSc7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBleHBlY3RlZCBBUklBIGFjY2Vzc2libGUgbmFtZSBmb3IgZ2l2ZW4gRE9NIE5vZGUuIEdpdmVuIERPTSBOb2RlIG1heSBiZSBlaXRoZXIgdGhlXG4gKiBcIlJvb3Qgbm9kZVwiIHBhc3NlZCB0byBgX2NvbXB1dGVBcmlhQWNjZXNzaWJsZU5hbWVgIG9yIFwiQ3VycmVudCBub2RlXCIgYXMgcmVzdWx0IG9mIHJlY3Vyc2lvbi5cbiAqXG4gKiBAcmV0dXJuIHRoZSBhY2Nlc3NpYmxlIG5hbWUgb2YgYXJndW1lbnQgRE9NIE5vZGVcbiAqXG4gKiBAcGFyYW0gY3VycmVudE5vZGUgbm9kZSB0byBkZXRlcm1pbmUgYWNjZXNzaWJsZSBuYW1lIG9mXG4gKiBAcGFyYW0gaXNEaXJlY3RseVJlZmVyZW5jZWQgdHJ1ZSBpZiBgY3VycmVudE5vZGVgIGlzIHRoZSByb290IG5vZGUgdG8gY2FsY3VsYXRlIEFSSUEgYWNjZXNzaWJsZVxuICogbmFtZSBvZi4gRmFsc2UgaWYgaXQgaXMgYSByZXN1bHQgb2YgcmVjdXJzaW9uLlxuICovXG5mdW5jdGlvbiBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZUludGVybmFsKFxuICBjdXJyZW50Tm9kZTogTm9kZSxcbiAgaXNEaXJlY3RseVJlZmVyZW5jZWQ6IGJvb2xlYW4sXG4pOiBzdHJpbmcge1xuICAvLyBOT1RFOiB0aGlzIGRpZmZlcnMgZnJvbSBhY2NuYW1lLTEuMiBzcGVjaWZpY2F0aW9uLlxuICAvLyAgLSBEb2VzIG5vdCBpbXBsZW1lbnQgU3RlcCAxLiBvZiBhY2NuYW1lLTEuMjogJycnSWYgYGN1cnJlbnROb2RlYCdzIHJvbGUgcHJvaGliaXRzIG5hbWluZyxcbiAgLy8gICAgcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcgKFwiXCIpJycnLlxuICAvLyAgLSBEb2VzIG5vdCBpbXBsZW1lbnQgU3RlcCAyLkEuIG9mIGFjY25hbWUtMS4yOiAnJydpZiBjdXJyZW50IG5vZGUgaXMgaGlkZGVuIGFuZCBub3QgZGlyZWN0bHlcbiAgLy8gICAgcmVmZXJlbmNlZCBieSBhcmlhLWxhYmVsbGVkYnkuLi4gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcuJycnXG5cbiAgLy8gYWNjLW5hbWUtMS4yIFN0ZXAgMi5CLjogYXJpYS1sYWJlbGxlZGJ5XG4gIGlmIChzc3JTYWZlSXNFbGVtZW50KGN1cnJlbnROb2RlKSAmJiBpc0RpcmVjdGx5UmVmZXJlbmNlZCkge1xuICAgIGNvbnN0IGxhYmVsbGVkYnlJZHM6IHN0cmluZ1tdID1cbiAgICAgIGN1cnJlbnROb2RlLmdldEF0dHJpYnV0ZT8uKCdhcmlhLWxhYmVsbGVkYnknKT8uc3BsaXQoL1xccysvZykgfHwgW107XG4gICAgY29uc3QgdmFsaWRJZFJlZnM6IEhUTUxFbGVtZW50W10gPSBsYWJlbGxlZGJ5SWRzLnJlZHVjZSgodmFsaWRJZHMsIGlkKSA9PiB7XG4gICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgdmFsaWRJZHMucHVzaChlbGVtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZElkcztcbiAgICB9LCBbXSBhcyBIVE1MRWxlbWVudFtdKTtcblxuICAgIGlmICh2YWxpZElkUmVmcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB2YWxpZElkUmVmc1xuICAgICAgICAubWFwKGlkUmVmID0+IHtcbiAgICAgICAgICByZXR1cm4gX2NvbXB1dGVBcmlhQWNjZXNzaWJsZU5hbWVJbnRlcm5hbChpZFJlZiwgZmFsc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignICcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFjYy1uYW1lLTEuMiBTdGVwIDIuQy46IGFyaWEtbGFiZWxcbiAgaWYgKHNzclNhZmVJc0VsZW1lbnQoY3VycmVudE5vZGUpKSB7XG4gICAgY29uc3QgYXJpYUxhYmVsID0gY3VycmVudE5vZGUuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk/LnRyaW0oKTtcblxuICAgIGlmIChhcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBhcmlhTGFiZWw7XG4gICAgfVxuICB9XG5cbiAgLy8gYWNjLW5hbWUtMS4yIFN0ZXAgMi5ELiBhdHRyaWJ1dGUgb3IgZWxlbWVudCB0aGF0IGRlZmluZXMgYSB0ZXh0IGFsdGVybmF0aXZlXG4gIC8vXG4gIC8vIE5PVEU6IHRoaXMgZGlmZmVycyBmcm9tIGFjY25hbWUtMS4yIHNwZWNpZmljYXRpb24uXG4gIC8vIE9ubHkgaW1wbGVtZW50cyBTdGVwIDIuRC4gZm9yIGA8bGFiZWw+YCxgPGlucHV0Lz5gLCBhbmQgYDx0ZXh0YXJlYS8+YCBlbGVtZW50LiBEb2VzIG5vdFxuICAvLyBpbXBsZW1lbnQgb3RoZXIgZWxlbWVudHMgdGhhdCBoYXZlIGFuIGF0dHJpYnV0ZSBvciBlbGVtZW50IHRoYXQgZGVmaW5lcyBhIHRleHQgYWx0ZXJuYXRpdmUuXG4gIGlmIChzc3JTYWZlSXNIVE1MSW5wdXRFbGVtZW50KGN1cnJlbnROb2RlKSB8fCBzc3JTYWZlSXNIVE1MVGV4dEFyZWFFbGVtZW50KGN1cnJlbnROb2RlKSkge1xuICAgIC8vIHVzZSBsYWJlbCB3aXRoIGEgYGZvcmAgYXR0cmlidXRlIHJlZmVyZW5jaW5nIHRoZSBjdXJyZW50IG5vZGVcbiAgICBpZiAoY3VycmVudE5vZGUubGFiZWxzPy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGN1cnJlbnROb2RlLmxhYmVscylcbiAgICAgICAgLm1hcCh4ID0+IF9jb21wdXRlQXJpYUFjY2Vzc2libGVOYW1lSW50ZXJuYWwoeCwgZmFsc2UpKVxuICAgICAgICAuam9pbignICcpO1xuICAgIH1cblxuICAgIC8vIHVzZSBwbGFjZWhvbGRlciBpZiBhdmFpbGFibGVcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGN1cnJlbnROb2RlLmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKT8udHJpbSgpO1xuICAgIGlmIChwbGFjZWhvbGRlcikge1xuICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xuICAgIH1cblxuICAgIC8vIHVzZSB0aXRsZSBpZiBhdmFpbGFibGVcbiAgICBjb25zdCB0aXRsZSA9IGN1cnJlbnROb2RlLmdldEF0dHJpYnV0ZSgndGl0bGUnKT8udHJpbSgpO1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgcmV0dXJuIHRpdGxlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5PVEU6IHRoaXMgZGlmZmVycyBmcm9tIGFjY25hbWUtMS4yIHNwZWNpZmljYXRpb24uXG4gIC8vICAtIGRvZXMgbm90IGltcGxlbWVudCBhY2MtbmFtZS0xLjIgU3RlcCAyLkUuOiAnJydpZiB0aGUgY3VycmVudCBub2RlIGlzIGEgY29udHJvbCBlbWJlZGRlZFxuICAvLyAgICAgd2l0aGluIHRoZSBsYWJlbC4uLiB0aGVuIGluY2x1ZGUgdGhlIGVtYmVkZGVkIGNvbnRyb2wgYXMgcGFydCBvZiB0aGUgdGV4dCBhbHRlcm5hdGl2ZSBpblxuICAvLyAgICAgdGhlIGZvbGxvd2luZyBtYW5uZXIuLi4nJycuIFN0ZXAgMkUgYXBwbGllcyB0byBlbWJlZGRlZCBjb250cm9scyBzdWNoIGFzIHRleHRib3gsIGxpc3Rib3gsXG4gIC8vICAgICByYW5nZSwgZXRjLlxuICAvLyAgLSBkb2VzIG5vdCBpbXBsZW1lbnQgYWNjLW5hbWUtMS4yIHN0ZXAgMi5GLjogY2hlY2sgdGhhdCAnJydyb2xlIGFsbG93cyBuYW1lIGZyb20gY29udGVudCcnJyxcbiAgLy8gICAgd2hpY2ggYXBwbGllcyB0byBgY3VycmVudE5vZGVgIGFuZCBpdHMgY2hpbGRyZW4uXG4gIC8vICAtIGRvZXMgbm90IGltcGxlbWVudCBhY2MtbmFtZS0xLjIgU3RlcCAyLkYuaWkuOiAnJydDaGVjayBmb3IgQ1NTIGdlbmVyYXRlZCB0ZXh0dWFsIGNvbnRlbnQnJydcbiAgLy8gICAgKGUuZy4gOmJlZm9yZSBhbmQgOmFmdGVyKS5cbiAgLy8gIC0gZG9lcyBub3QgaW1wbGVtZW50IGFjYy1uYW1lLTEuMiBTdGVwIDIuSS46ICcnJ2lmIHRoZSBjdXJyZW50IG5vZGUgaGFzIGEgVG9vbHRpcCBhdHRyaWJ1dGUsXG4gIC8vICAgIHJldHVybiBpdHMgdmFsdWUnJydcblxuICAvLyBSZXR1cm4gdGV4dCBjb250ZW50IHdpdGggd2hpdGVzcGFjZSBjb2xsYXBzZWQgaW50byBhIHNpbmdsZSBzcGFjZSBjaGFyYWN0ZXIuIEFjY29tcGxpc2hcbiAgLy8gYWNjLW5hbWUtMS4yIHN0ZXBzIDJGLCAyRywgYW5kIDJILlxuICByZXR1cm4gKGN1cnJlbnROb2RlLnRleHRDb250ZW50IHx8ICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xufVxuIl19