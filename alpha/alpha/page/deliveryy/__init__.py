import frappe

@frappe.whitelist()
def get_delivery_page_data():
    data = frappe.get_all("Delivery Challan Item", 
                          fields=["product", "qty"])
        
    return data

@frappe.whitelist()
def get_delivery_page_data_amount():
    data = frappe.get_all("Delivery Challan Item", 
                          fields=["product", "billing_price"])
        
    return data