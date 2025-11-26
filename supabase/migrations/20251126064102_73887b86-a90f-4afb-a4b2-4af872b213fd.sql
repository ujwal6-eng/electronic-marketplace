-- Fix security issues: Add missing RLS policies

-- Order Status History: Users and store owners can view, store owners and admins can manage
CREATE POLICY "Users can view own order history" ON order_status_history FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Store owners can view their order history" ON order_status_history FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  JOIN order_items ON orders.id = order_items.order_id 
  JOIN stores ON order_items.store_id = stores.id 
  WHERE orders.id = order_status_history.order_id AND stores.owner_id = auth.uid()
));

CREATE POLICY "Store owners can create order history" ON order_status_history FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  JOIN order_items ON orders.id = order_items.order_id 
  JOIN stores ON order_items.store_id = stores.id 
  WHERE orders.id = order_status_history.order_id AND stores.owner_id = auth.uid()
));

CREATE POLICY "Admins can manage order history" ON order_status_history FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Transactions: Users can view own, admins can manage all
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions" ON transactions FOR ALL 
USING (has_role(auth.uid(), 'admin'));